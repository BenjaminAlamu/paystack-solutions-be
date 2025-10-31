import { Knex } from "knex";
import { DB_TABLES } from "../../shared/enums/db-tables.enum";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(DB_TABLES.ORDER_PAYMENT_DETAILS, (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));

    // Foreign key to Orders
    table.uuid("orderId").notNullable();
    table
      .foreign("orderId")
      .references("id")
      .inTable(DB_TABLES.ORDERS)
      .onDelete("CASCADE");

    // General payment fields
    table.string("paymentReference", 255).nullable();
    table.string("status", 50).nullable();
    table.string("channel", 50).notNullable(); // e.g., PAYSTACK, BANK_TRANSFER, etc.
    table.decimal("amount", 14, 2).notNullable();
    table.string("transactionId", 255).nullable();
    table.jsonb("metaData").nullable(); // Holds any dynamic Paystack or extra data

    // Paystack-specific details
    table.string("authorization_url", 500).nullable();
    table.string("offline_reference", 255).nullable();
    table.string("account_number", 50).nullable();
    table.string("bank_name", 255).nullable();

    // Timestamps
    table.timestamp("createdAt").notNullable().defaultTo(knex.fn.now());
    table.timestamp("updatedAt").notNullable().defaultTo(knex.fn.now());

    // Indexes
    table.index(["orderId"]);
    table.index(["paymentReference"]);
    table.index(["transactionId"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists(DB_TABLES.ORDER_PAYMENT_DETAILS);
}
