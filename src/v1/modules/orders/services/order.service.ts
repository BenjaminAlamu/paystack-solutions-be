import { injectable } from "tsyringe";
import { Request } from "express";
import ProductRepository from "../../products/repositories/product.repo";
import OrderRepository from "../repositories/order.repo";
import OrderItemRepository from "../repositories/order-item.repo";
import MerchantRepository from "../../auth/repositories/merchant.repo";
import UserRepository from "../../auth/repositories/user.repo";
import OrderFactory from "../factories/order.factory";
import OrderPaymentDetailsRepository from "../repositories/order-payment-details.repo";
import OrderPaymentDetailsFactory from "../factories/order-payment-details.factory";
import { PaystackHttpClient } from "@shared/http-client/paystack.http-client";
import { OrderPaymentMethod } from "../enums/order.enum";
import { PaystackChargeSuccessEvent, SingleOrderDto } from "../dtos/order.dto";
import { PAYSTACK_MULTIPLIER } from "@shared/enums/paystack.enum";
import { GetRandomID } from "@shared/utils/functions.util";

@injectable()
class ProductService {
  constructor(
    private readonly productRepo: ProductRepository,
    private readonly orderItemRepo: OrderItemRepository,
    private readonly orderRepo: OrderRepository,
    private readonly merchantRepo: MerchantRepository,
    private readonly userRepo: UserRepository,
    private readonly paystackClient: PaystackHttpClient,
    private readonly orderPaymentDetailsRepo: OrderPaymentDetailsRepository
  ) {}

  async getAll(req: Request) {
    const { search = "", page = 1, perPage = 15 } = req.query;

    return await this.orderRepo.getAll(
      {
        search: { name: search },
        page: page as number,
        perPage: perPage as number,
      },
      ["merchant", "driver", "user"]
    );
  }

  async getSingleOrder(code: string) {
    return await this.orderRepo.findByOrderRef(code, [
      "merchant",
      "driver",
      "user",
      "items",
      "paymentDetails",
    ]);
  }

  async createOrder(data: SingleOrderDto) {
    const { items, paymentMode, userId } = data;

    // Get Product to get Price
    const formattedItems = await Promise.all(
      items.map(async (element) => {
        const product = await this.productRepo.findById(element.productId);

        return {
          productId: product.id,
          quantity: element.quantity,
          price: parseFloat(product.price),
          subtotal: element.quantity * parseFloat(product.price),
          merchantId: product.merchantId,
        };
      })
    );

    // Get Merchant
    const merchant = await this.merchantRepo.findById(
      formattedItems[0].merchantId
    );

    const user = await this.userRepo.findById(userId);

    // Calculate Total price
    const totalAmount = formattedItems.reduce(
      (sum, item) => sum + item.subtotal,
      0
    );

    const totalQuantity = formattedItems.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    // Create Order
    const order = OrderFactory.create({
      merchantId: merchant.id,
      totalAmount,
      totalQuantity,
      userId: userId || "",
      paymentMode,
    });

    const createdOrder = await this.orderRepo.save(order);
    // Create OrderItem

    const orderItems = formattedItems.map((item) => {
      return OrderFactory.createOrderItem({
        ...item,
        orderId: createdOrder.id,
      });
    });

    await this.orderItemRepo.saveBulk(orderItems);
    // Create paystack flow
    let paystackDetails;

    if (paymentMode === OrderPaymentMethod.CHECKOUT) {
      paystackDetails = await this.paystackClient.createTransaction({
        email: user.email,
        amount: totalAmount * PAYSTACK_MULTIPLIER,
        subaccount: merchant.paystackSubaccountCode,
        metadata: {
          orderRef: createdOrder.orderRef,
        },
      });
    }
    if (paymentMode === OrderPaymentMethod.TERMINAL) {
      paystackDetails = await this.paystackClient.createInvoice({
        description: user.email,
        amount: totalAmount * PAYSTACK_MULTIPLIER,
        split_code: merchant.paystackSplitCode,
        customer: user.paystackCustomerId || "",
        metadata: {
          orderRef: createdOrder.orderRef,
        },
      });
    }

    const orderPaymentDetails = OrderPaymentDetailsFactory.create({
      orderId: createdOrder.id,
      amount: totalAmount,
      channel: paymentMode,
      authorization_url: paystackDetails?.authorization_url || "",
      offline_reference: paystackDetails?.offline_reference || "",
      reference: createdOrder.orderRef,
    });

    await this.orderPaymentDetailsRepo.save(orderPaymentDetails);

    return { order: createdOrder, paymentDetails: orderPaymentDetails };
  }

  async paystackCallback(payload: PaystackChargeSuccessEvent) {
    const { data, event } = payload;
    if (event !== "charge.success" && event !== "transfer.success") return;
    const paystackResponse = await this.paystackClient.verifyTransaction(
      data.reference
    );
    const transactionStatus = paystackResponse.status;
    if (transactionStatus === "success") {
      const orderDetails = await this.orderRepo.findByOrderRef(
        data.metadata.orderRef, [   "paymentDetails",]
      );
      const orderDetailsData = OrderFactory.markOrderSuccessful();
      if (!orderDetails) return;
      await this.orderRepo.updateById(orderDetails.id, orderDetailsData);

      const paymentDetails = await this.orderPaymentDetailsRepo.findByOrderId(
        orderDetails.id
      );
      const paymentDetailsData =
        OrderPaymentDetailsFactory.confirmPaymentDetails({
          status: data.status,
          id: data.id.toString(),
          transactionResponse: data,
        });
      if (!paymentDetails) return;
      await this.orderPaymentDetailsRepo.updateById(
        paymentDetails.id,
        paymentDetailsData
      );

      return {};
    }
  }

  async attachDynamicVirtualAccount(code: string) {
    const order = await this.orderRepo.findByOrderRef(code, ["paymentDetails"]);
    if (!order || !order.paymentDetails) return;
    const user = await this.userRepo.findById(order?.userId);
    const merchant = await this.merchantRepo.findById(order?.merchantId);
    if (!user || !merchant) return;

    const paystackDVAPayload = {
      customer: user.paystackCustomerId || "",
      split_code: merchant.paystackSplitCode,
      metadata: {
        // Would be used to track the payment on callback
        orderRef: code,
      },
    };

    const response = await this.paystackClient.createDynamicVirtualAccount(
      paystackDVAPayload
    );

    const paymentDetails = await this.orderPaymentDetailsRepo.findById(
      order.paymentDetails.id
    );
    const paymentDetailsData =
      OrderPaymentDetailsFactory.attachVirtualAccountDetails({
        account_number: response.account_number,
        bank_name: response.bank.name,
      });
    if (!paymentDetails) return;
    await this.orderPaymentDetailsRepo.updateById(
      paymentDetails.id,
      paymentDetailsData
    );
    return response;
  }

  async mockCallback(code: string) {
      const orderDetails = await this.orderRepo.findByOrderRef(code, [   "paymentDetails"]);
      const orderDetailsData = OrderFactory.markOrderSuccessful();
      if (!orderDetails) return;
      await this.orderRepo.updateById(orderDetails.id, orderDetailsData);
  
      const paymentDetails = await this.orderPaymentDetailsRepo.findByOrderId(
        orderDetails.id
      );
      const paymentDetailsData = OrderPaymentDetailsFactory.confirmPaymentDetails(
        { status: "success", id: GetRandomID(12), transactionResponse: {} }
      );
      if (!paymentDetails) return;
      await this.orderPaymentDetailsRepo.updateById(
        paymentDetails.id,
        paymentDetailsData
      );
    return {};

  }
}

export default ProductService;
