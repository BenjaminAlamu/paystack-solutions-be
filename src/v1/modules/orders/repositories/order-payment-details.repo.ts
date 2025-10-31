import { BaseRepository } from "@shared/repositories/base.repo";
import { IOrderPaymentDetails, OrderPaymentDetails } from "../models/order-payment-details.model";

class OrderPaymentDetailsRepository extends BaseRepository<IOrderPaymentDetails, OrderPaymentDetails> {
  constructor() {
    super(OrderPaymentDetails);
  }

  async findByOrderId(orderId: string) {
    return await OrderPaymentDetails.query()
      .findOne({ orderId })
  }
}

export default OrderPaymentDetailsRepository;
