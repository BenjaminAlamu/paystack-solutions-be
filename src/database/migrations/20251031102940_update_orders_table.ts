import { Knex } from "knex";
import { DB_TABLES } from "../../shared/enums/db-tables.enum";

export async function up(knex: Knex): Promise<void> {
  const hasColumn = await knex.schema.hasColumn(DB_TABLES.ORDERS, "userId");

  if (!hasColumn) {
    await knex.schema.alterTable(DB_TABLES.ORDERS, (table) => {
      table
        .uuid("userId")
        .nullable()
        .references("id")
        .inTable(DB_TABLES.USERS)
        .onDelete("SET NULL");
    });
  } else {
   return
  }
}

export async function down(knex: Knex): Promise<void> {
  const hasColumn = await knex.schema.hasColumn(DB_TABLES.ORDERS, "userId");

  if (hasColumn) {
    await knex.schema.alterTable(DB_TABLES.ORDERS, (table) => {
      table.dropColumn("userId");
    });
  }
}
