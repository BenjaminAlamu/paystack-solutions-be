import { Model, ModelObject } from "objection";
import { DB_TABLES } from "@shared/enums/db-tables.enum";
import { Product } from "../../products/models/product.model";
import { Order } from "./order.model";

export class OrderItem extends Model {
  static tableName = DB_TABLES.ORDER_ITEMS;

  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number; // price at time of purchase
  subtotal: number; // price * quantity
  createdAt: Date;
  updatedAt: Date;

  product?: Product;
  order?: Order;

  static relationMappings = {
    order: {
      relation: Model.BelongsToOneRelation,
      modelClass: Order,
      join: {
        from: `${DB_TABLES.ORDER_ITEMS}.orderId`,
        to: `${DB_TABLES.ORDERS}.id`,
      },
    },
    product: {
      relation: Model.BelongsToOneRelation,
      modelClass: Product,
      join: {
        from: `${DB_TABLES.ORDER_ITEMS}.productId`,
        to: `${DB_TABLES.PRODUCTS}.id`,
      },
      filter: (query) =>
      query.select(["name", "imageUrl"]),
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

export type IOrderItem = ModelObject<OrderItem>;
