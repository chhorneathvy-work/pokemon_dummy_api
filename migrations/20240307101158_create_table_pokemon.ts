import knex, { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  if (!await knex.schema.hasTable("pokemon")) {
    await knex.schema.createTable("pokemon", (table) => {
      table.increments();
      table.integer("category_id");
      table.string("pokemon_name");
      table.text("pokemon_description", "LONGTEXT");
      table.string("pokemon_image");
      table.timestamps(true, true);
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("pokemon");
}
