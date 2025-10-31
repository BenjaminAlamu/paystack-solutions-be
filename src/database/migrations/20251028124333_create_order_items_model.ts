import { Knex } from "knex";
import { DB_TABLES } from "../../shared/enums/db-tables.enum";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(DB_TABLES.ORDER_ITEMS, (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));

    // Foreign keys
    table.uuid("orderId").notNullable();
    table
      .foreign("orderId")
      .references("id")
      .inTable(DB_TABLES.ORDERS)
      .onDelete("CASCADE");

    table.uuid("productId").notNullable();
    table
      .foreign("productId")
      .references("id")
      .inTable(DB_TABLES.PRODUCTS)
      .onDelete("RESTRICT");

    // Item details
    table.integer("quantity").notNullable().defaultTo(1);
    table.decimal("price", 14, 2).notNullable(); // Price at time of purchase
    table.decimal("subtotal", 14, 2).notNullable(); // price * quantity

    // Timestamps
    table.timestamp("createdAt").notNullable().defaultTo(knex.fn.now());
    table.timestamp("updatedAt").notNullable().defaultTo(knex.fn.now());

    // Indexes for performance
    table.index(["orderId"]);
    table.index(["productId"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists(DB_TABLES.ORDER_ITEMS);
}
