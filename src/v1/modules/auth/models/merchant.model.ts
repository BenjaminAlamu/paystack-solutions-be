import { Model, ModelObject } from "objection";
import { DB_TABLES } from "@shared/enums/db-tables.enum";
import { User } from "./user.model";

export class Merchant extends Model {
  static tableName = DB_TABLES.MERCHANTS;

  id: string;
  userId: string;

  // Business details
  businessName: string;

  // Paystack information
  paystackSubaccountCode: string; // e.g. ACCT_xxxxxxx
  paystackSplitCode: string;  // optional: Paystack integration ref
  bankCode: string;
  bankAccountNumber: string;

  createdAt: Date;
  updatedAt: Date;

  static relationMappings = {
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: `${DB_TABLES.MERCHANTS}.userId`,
        to: `${DB_TABLES.USERS}.id`,
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

  static modifiers = {
    selectMerchantFields(builder) {
      builder.select("id", "businessName");
    },
  };
}

export type IMerchant = ModelObject<Merchant>;
