import { BaseRepository } from "@shared/repositories/base.repo";
import { IOrderItem, OrderItem } from "../models/order-item.model";

class OrderItemRepository extends BaseRepository<IOrderItem, OrderItem> {
  constructor() {
    super(OrderItem);
  }

}

export default OrderItemRepository;
