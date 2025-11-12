import { Knex } from "knex";
import { DB_TABLES } from "../../shared/enums/db-tables.enum";

export async function up(knex: Knex): Promise<void> {
  const hasSplitCodeColumn = await knex.schema.hasColumn(DB_TABLES.ORDER_PAYMENT_DETAILS, "split_code");

  if (!hasSplitCodeColumn) {
    await knex.schema.alterTable(DB_TABLES.ORDER_PAYMENT_DETAILS, (table) => {
      table.string("split_code").nullable();
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  const hasSplitCodeColumn = await knex.schema.hasColumn(DB_TABLES.ORDER_PAYMENT_DETAILS, "split_code");

  if (hasSplitCodeColumn) {
    await knex.schema.alterTable(DB_TABLES.ORDER_PAYMENT_DETAILS, (table) => {
      table.dropColumn("split_code");
    });
  }
}