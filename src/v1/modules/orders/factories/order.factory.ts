import { GetRandomID } from "@shared/utils/functions.util";
import { IOrder } from "../models/order.model";
import { OrderDto, OrderItemDto } from "../dtos/order.dto";
import { OrderStatus } from "../enums/order.enum";
import { IOrderItem } from "../models/order-item.model";

class OrderFactory {
  static create(data: OrderDto) {
    const order = {} as IOrder;
    order.merchantId = data.merchantId;
    order.orderRef = `ORD-${GetRandomID(6)}-${GetRandomID(6)}`;
    order.userId = data.userId;
    order.totalAmount = data.totalAmount;
    order.status = OrderStatus.PENDING;
    return order;
  }
  
  static createOrderItem(data: OrderItemDto) {
    const orderItem = {} as IOrderItem;
    orderItem.orderId = data.orderId;
    orderItem.productId = data.productId;
    orderItem.quantity = data.quantity;
    orderItem.price = data.price;
    orderItem.subtotal = data.quantity * data.price;
    return orderItem;
  }

  static markOrderSuccessful() {
    const order = {} as Partial<IOrder>;
    order.status = OrderStatus.SUCCESSFUL;
    return order;
  }

}

export default OrderFactory;
