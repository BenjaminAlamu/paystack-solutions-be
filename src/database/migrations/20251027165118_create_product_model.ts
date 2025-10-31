import { Knex } from "knex";
import { DB_TABLES } from "../../shared/enums/db-tables.enum";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(DB_TABLES.PRODUCTS, (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table
      .uuid("merchantId")
      .notNullable()
      .references("id")
      .inTable(DB_TABLES.MERCHANTS)
      .onDelete("CASCADE");

    table.string("name", 255).notNullable();
    table.string("slug", 255).notNullable().unique();
    table.text("description").nullable();
    table.decimal("price", 12, 2).notNullable();
    table.integer("stockQuantity").notNullable().defaultTo(0);
    table.string("imageUrl").nullable();

    table.timestamp("createdAt").notNullable().defaultTo(knex.fn.now());
    table.timestamp("updatedAt").notNullable().defaultTo(knex.fn.now());

    // Indexes
    table.index(["merchantId", "name"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists(DB_TABLES.PRODUCTS);
}
