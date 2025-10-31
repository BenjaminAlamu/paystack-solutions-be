import { Model, ModelObject } from "objection";
import { DB_TABLES } from "@shared/enums/db-tables.enum";
import { OrderItem } from "./order-item.model";
import { Merchant } from "../../auth/models/merchant.model";
import { User } from "../../auth/models/user.model";
import { OrderPaymentDetails } from "./order-payment-details.model";

export class Order extends Model {
  static tableName = DB_TABLES.ORDERS;

  id: string;
  merchantId: string;
  userId: string;
  totalAmount: number;
  status: string; // e.g. 'PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'
  orderRef: string;
  createdAt: Date;
  updatedAt: Date;
  driverId?: string;

  // Relations
  items?: OrderItem[];
  merchant: Merchant;
  
  driver?: User;
  user?: User;
  paymentDetails?: OrderPaymentDetails;

  static relationMappings = {
    items: {
      relation: Model.HasManyRelation,
      modelClass: OrderItem,
      join: {
        from: `${DB_TABLES.ORDERS}.id`,
        to: `${DB_TABLES.ORDER_ITEMS}.orderId`,
      },
    },
    merchant: {
      relation: Model.BelongsToOneRelation,
      modelClass: Merchant,
      join: {
        from: `${DB_TABLES.ORDERS}.merchantId`,
        to: `${DB_TABLES.MERCHANTS}.id`,
      },
      filter: (query) =>
      query.select(["businessName", "id", "bankAccountNumber"]),
    },
    driver: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: `${DB_TABLES.ORDERS}.driverId`,
          to: `${DB_TABLES.USERS}.id`,
        },
        filter: (query) =>
        query.select(["firstName", "lastName", "email"]),
      },
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: `${DB_TABLES.ORDERS}.userId`,
          to: `${DB_TABLES.USERS}.id`,
        },
        filter: (query) =>
        query.select(["firstName", "lastName", "email"]),
      },
      paymentDetails: {
        relation: Model.HasOneRelation,
        modelClass: OrderPaymentDetails,
        join: {
          from: `${DB_TABLES.ORDERS}.id`,
          to: `${DB_TABLES.ORDER_PAYMENT_DETAILS}.orderId`,
        },
        filter: (query) =>
          query.select(["status", "channel", "paymentReference", "amount", "offline_reference", "id"]),
      },
  };

  $beforeInsert(): void {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  $beforeUpdate(): void {
    this.updatedAt = new Date();
  }
}

export type IOrder = ModelObject<Order>;
