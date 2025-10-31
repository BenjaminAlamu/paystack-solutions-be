import { Model, ModelObject } from "objection";
import { DB_TABLES } from "@shared/enums/db-tables.enum";
import { Merchant } from "../../auth/models/merchant.model";

export class Product extends Model {
  static tableName = DB_TABLES.PRODUCTS; // make sure this exists in your DB_TABLES enum

  id: string;
  name: string;
  slug: string;
  description?: string;
  price: string;
  stockQuantity: number;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;

  merchantId: string;
  merchant: Merchant;

  static relationMappings = {
    merchant: {
      relation: Model.BelongsToOneRelation,
      modelClass: Merchant,
      join: {
        from: `${DB_TABLES.PRODUCTS}.merchantId`,
        to: `${DB_TABLES.MERCHANTS}.id`,
      },
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

export type IProduct = ModelObject<Product>;
