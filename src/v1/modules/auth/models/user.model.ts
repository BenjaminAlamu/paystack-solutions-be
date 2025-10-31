import { Model, ModelObject } from "objection";
import { DB_TABLES } from "@shared/enums/db-tables.enum";
import { UserType } from "../enums/user-type.enum";

export class User extends Model {
  static tableName = DB_TABLES.USERS; // Make sure this exists in DB_TABLES enum

  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  userType: UserType;
  paystackCustomerId?: string;
  createdAt: Date;
  updatedAt: Date;

  static relationMappings = {
    // Example relations (optional)
    // orders: {
    //   relation: Model.HasManyRelation,
    //   modelClass: `${__dirname}/Order`,
    //   join: {
    //     from: `${DB_TABLES.USERS}.id`,
    //     to: `${DB_TABLES.ORDERS}.userId`,
    //   },
    // },
  };

  $beforeInsert(): void {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  $beforeUpdate(): void {
    this.updatedAt = new Date();
  }
}

export type IUser = ModelObject<User>;
