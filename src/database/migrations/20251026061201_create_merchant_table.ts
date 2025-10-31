import { Knex } from "knex";
import { DB_TABLES } from "../../shared/enums/db-tables.enum";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(DB_TABLES.MERCHANTS, (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.uuid("userId").notNullable().unique();
    
    // Business details
    table.string("businessName", 255).notNullable();
    
    // Paystack information
    table.string("paystackSubaccountCode", 255).notNullable();
    table.string("paystackSplitCode", 255).nullable();
    table.string("bankCode", 50).notNullable();
    table.string("bankAccountNumber", 50).notNullable();
    
    table.timestamp("createdAt").notNullable().defaultTo(knex.fn.now());
    table.timestamp("updatedAt").notNullable().defaultTo(knex.fn.now());
    
    // Foreign key constraint
    table.foreign("userId").references("id").inTable(DB_TABLES.USERS).onDelete("CASCADE");
    
    // Indexes
    table.index("userId");
    table.index("paystackSubaccountCode");
    table.index("paystackSplitCode");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists(DB_TABLES.MERCHANTS);
}