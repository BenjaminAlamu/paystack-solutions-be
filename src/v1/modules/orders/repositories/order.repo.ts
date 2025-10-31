import { BaseRepository } from "@shared/repositories/base.repo";
import { IOrder, Order } from "../models/order.model";

class OrderRepository extends BaseRepository<IOrder, Order> {
  constructor() {
    super(Order);
  }

  async findByOrderRef(orderRef: string, relations: string[] = []) {
    return await Order.query()
      .findOne({ orderRef })
      .withGraphFetched(`[${relations.join(",")}, items.[product]]`);
  }
}

export default OrderRepository;
