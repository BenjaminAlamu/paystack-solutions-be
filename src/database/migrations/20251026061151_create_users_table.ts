import { Knex } from "knex";
import { DB_TABLES } from "../../shared/enums/db-tables.enum";

export async function up(knex: Knex): Promise<void> {

  return knex.schema.createTable(DB_TABLES.USERS, (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.string("firstName", 255).notNullable();
    table.string("lastName", 255).notNullable();
    table.string("email", 255).notNullable().unique();
    table.string("password", 255).notNullable();
    table.string("userType", 50).notNullable(); 
    table.string("paystackCustomerId", 255).nullable();
    table.timestamp("createdAt").notNullable().defaultTo(knex.fn.now());
    table.timestamp("updatedAt").notNullable().defaultTo(knex.fn.now());

    // Indexes
    table.index("email");
    table.index("userType");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists(DB_TABLES.USERS);
  await knex.raw("DROP TYPE IF EXISTS userType;");
}