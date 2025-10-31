import { OrderPaymentDetails } from "../models/order-payment-details.model";
import { AttachVirtualAccountDto, ConfirmPaymentDetailsDto, CreatePaymentDetailsDto } from "../dtos/order-details.dto";
import { OrderPaymentStatus } from "../enums/order.enum";

class OrderPaymentDetailsFactory {
  static create(data: CreatePaymentDetailsDto) {
    const orderDetails = {} as OrderPaymentDetails;
    orderDetails.orderId = data.orderId;
    orderDetails.channel = data.channel;
    orderDetails.amount = data.amount;
    orderDetails.status = OrderPaymentStatus.PENDING;
    orderDetails.authorization_url = data.authorization_url || "";
    orderDetails.offline_reference = data.offline_reference  || "";
    orderDetails.paymentReference = data.reference;
    return orderDetails;
  }

  static attachVirtualAccountDetails(data: AttachVirtualAccountDto) {
    const orderDetails = {} as Partial<OrderPaymentDetails>;
    orderDetails.account_number = data.account_number;
    orderDetails.bank_name = data.bank_name;
    return orderDetails;
  }

  static confirmPaymentDetails(data: ConfirmPaymentDetailsDto) {
    const orderDetails = {} as Partial<OrderPaymentDetails>;
    orderDetails.status = OrderPaymentStatus.SUCCESS;
    orderDetails.transactionId = data.id;
    orderDetails.metaData = data.transactionResponse;
    return orderDetails;
  }
  
}

export default OrderPaymentDetailsFactory;
