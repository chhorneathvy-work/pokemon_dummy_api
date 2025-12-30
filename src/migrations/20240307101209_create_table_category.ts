import knex, { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  if (!await knex.schema.hasTable("category")) {
    await knex.schema.createTable("category", (table) => {
      table.increments();
      table.string("name");
      table.timestamps(true, true);
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("category");
}

