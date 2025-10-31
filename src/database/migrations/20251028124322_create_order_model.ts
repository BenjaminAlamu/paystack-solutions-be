import { Knex } from "knex";
import { DB_TABLES } from "../../shared/enums/db-tables.enum";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(DB_TABLES.ORDERS, (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));

    // Merchant placing the order
    table
      .uuid("merchantId")
      .notNullable()
      .references("id")
      .inTable(DB_TABLES.MERCHANTS)
      .onDelete("CASCADE");

    // Customer who made the order
    table
      .uuid("userId")
      .notNullable()
      .references("id")
      .inTable(DB_TABLES.USERS)
      .onDelete("CASCADE");

    // Driver assigned to deliver (if applicable)
    table
      .uuid("driverId")
      .nullable()
      .references("id")
      .inTable(DB_TABLES.USERS)
      .onDelete("SET NULL");

    // Financials
    table.decimal("totalAmount", 12, 2).notNullable();

    // Order tracking
    table.string("status", 50).notNullable().defaultTo("PENDING");
    table.string("orderRef", 100).notNullable().unique();

    // Timestamps
    table.timestamp("createdAt").notNullable().defaultTo(knex.fn.now());
    table.timestamp("updatedAt").notNullable().defaultTo(knex.fn.now());

    // Indexes
    table.index(["merchantId"]);
    table.index(["userId"]);
    table.index(["status"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists(DB_TABLES.ORDERS);
}
