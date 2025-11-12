import { Model, ModelObject } from "objection";
import { DB_TABLES } from "@shared/enums/db-tables.enum";
import { Order } from "./order.model";
import { OrderPaymentMethod } from "../enums/order.enum";

export class OrderPaymentDetails extends Model {
  static tableName = DB_TABLES.ORDER_PAYMENT_DETAILS;

  id!: string;
  orderId: string;
  paymentReference?: string;
  status?: string;
  channel: OrderPaymentMethod;
  amount: number;
  transactionId?: string;
  metaData?: Record<string, any>;
  createdAt!: Date;
  updatedAt!: Date;

  // Paystack Detials
  authorization_url?: string;
  offline_reference?: string;
  account_number?: string;
  split_code?: string;
  bank_name?: string;

  order!: Order;

  static relationMappings = {
    order: {
      relation: Model.BelongsToOneRelation,
      modelClass: Order,
      join: {
        from: `${DB_TABLES.ORDER_PAYMENT_DETAILS}.orderId`,
        to: `${DB_TABLES.ORDERS}.id`,
      },
    },
  };

  $beforeInsert() {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  $beforeUpdate() {
    this.updatedAt = new Date();
  }
}

export type IOrderPaymentDetails = ModelObject<OrderPaymentDetails>;