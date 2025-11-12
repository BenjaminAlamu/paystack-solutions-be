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
  
    const itemsByMerchant = formattedItems.reduce((acc, item) => {
      if (!acc[item.merchantId]) acc[item.merchantId] = [];
      acc[item.merchantId].push(item);
      return acc;
    }, {} as Record<string, typeof formattedItems>);
  
    const merchantTotals = Object.entries(itemsByMerchant).map(
      ([merchantId, items]) => {
        const total = items.reduce((sum, item) => sum + item.subtotal, 0);
        return { merchantId, total };
      }
    );
  
    const user = await this.userRepo.findById(userId);
  
    const totalAmount = formattedItems.reduce(
      (sum, item) => sum + item.subtotal,
      0
    );
  
    const totalQuantity = formattedItems.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
  
    const merchantShares = merchantTotals.map((merchant) => ({
      merchantId: merchant.merchantId,
      total: merchant.total,
      percentage: (merchant.total / totalAmount) * 100,
    }));
  
    const platformPercentage = 10;
  
    // Compute Paystack Fee (₦100 + 1.5%, capped at ₦2000)
    const PAYSTACK_PERCENT_FEE = 0.015;
    const PAYSTACK_FLAT_FEE = 100;
    const PAYSTACK_FEE_CAP = 2000;
    let paystackFee =
      totalAmount * PAYSTACK_PERCENT_FEE + PAYSTACK_FLAT_FEE;
    if (paystackFee > PAYSTACK_FEE_CAP) paystackFee = PAYSTACK_FEE_CAP;
  
    // Split Paystack fee proportionally among merchants
    const merchantsWithFee = merchantShares.map((m) => {
      const proportionalFee = (m.total / totalAmount) * paystackFee;
      return {
        ...m,
        proportionalFee,
      };
    });
  
    // Adjust merchant percentages (platform fee + paystack fee impact)
    const adjustedMerchantShares = merchantsWithFee.map((merchant) => {
      const afterPlatform = (merchant.percentage * (100 - platformPercentage)) / 100;
      // Convert merchant’s proportional Paystack fee to percentage equivalent of total
      const paystackFeePercent = (merchant.proportionalFee / totalAmount) * 100;
      const adjustedPercentage = afterPlatform - paystackFeePercent;
      return {
        ...merchant,
        adjustedPercentage: parseFloat(adjustedPercentage.toFixed(2)),
      };
    });
  
    const subaccounts = await Promise.all(
      adjustedMerchantShares.map(async (merchant) => {
        const merchantAccount = await this.merchantRepo.findById(
          merchant.merchantId
        );
  
        return {
          subaccount: merchantAccount.paystackSubaccountCode,
          share: merchant.adjustedPercentage,
        };
      })
    );

  
    const splitDetails = await this.paystackClient.createTransactionSplit({
      name: `Order Split - ${user.email}`,
      type: "percentage",
      currency: "NGN",
      subaccounts,
      bearer_type: "account", // Platform bears Paystack fee initially
    });
  
    const merchant = await this.merchantRepo.findById(formattedItems[0].merchantId);
  
    const order = OrderFactory.create({
      merchantId: merchant.id,
      totalAmount,
      totalQuantity,
      userId: userId || "",
      paymentMode,
    });
  
    const createdOrder = await this.orderRepo.save(order);
  
    const orderItems = formattedItems.map((item) =>
      OrderFactory.createOrderItem({
        ...item,
        orderId: createdOrder.id,
      })
    );
  
    await this.orderItemRepo.saveBulk(orderItems);
  
    let paystackDetails;
    if (paymentMode === OrderPaymentMethod.CHECKOUT) {
      paystackDetails = await this.paystackClient.createTransaction({
        email: user.email,
        amount: totalAmount * PAYSTACK_MULTIPLIER,
        split_code: splitDetails.split_code,
        metadata: {
          orderRef: createdOrder.orderRef,
          splitCode: splitDetails.split_code,
          paystackFee,
        },
      });
    }
  
    if (paymentMode === OrderPaymentMethod.TERMINAL) {
      paystackDetails = await this.paystackClient.createInvoice({
        description: user.email,
        amount: totalAmount * PAYSTACK_MULTIPLIER,
        split_code: splitDetails.split_code,
        customer: user.paystackCustomerId || "",
        metadata: {
          orderRef: createdOrder.orderRef,
          splitCode: splitDetails.split_code,
          paystackFee,
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
      split_code: splitDetails.split_code,
    });
  
    await this.orderPaymentDetailsRepo.save(orderPaymentDetails);
  
    return {
      order: createdOrder,
      paymentDetails: orderPaymentDetails,
      paystackFee,
      subaccounts,
    };
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
        data.metadata.orderRef,
        ["paymentDetails"]
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
    const orderPaymentDetails = await this.orderPaymentDetailsRepo.findById(
      order.paymentDetails.id
    );
    const user = await this.userRepo.findById(order?.userId);
    const merchant = await this.merchantRepo.findById(order?.merchantId);
    if (!user || !merchant) return;

    const paystackDVAPayload = {
      customer: user.paystackCustomerId || "",
      split_code: orderPaymentDetails.split_code || "",
      metadata: {
        // Would be used to track the payment on callback
        orderRef: code,
        split_code: orderPaymentDetails.split_code || "",
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
    const orderDetails = await this.orderRepo.findByOrderRef(code, [
      "paymentDetails",
    ]);
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
