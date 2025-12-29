import { Graph } from "src/generated/graph";
import ContextType from "src/graphql/ContextType";

export const createPokemonMutation = async (
  _,
  { input }: { input: Graph.CreatePokemonInput },
  ctx: ContextType
) => {
  const knex = ctx.knex.default;

  try {
    // Normalize category name and find category
    console.log("INPUT CATEGORY:", input.category_name);

    const category = await knex("category")
      .whereRaw("LOWER(TRIM(name)) = LOWER(TRIM(?))", [input.category_name])
      .first();

    console.log("FOUND CATEGORY:", category);

    if (!category) {
      throw new Error(`Category "${input.category_name}" does not exist.`);
    }

    // Insert Pokémon and extract numeric ID correctly
    const inserted = await knex("pokemon")
      .insert({
        category_id: category.id,
        pokemon_name: input.pokemon_name,
        pokemon_description: input.pokemon_description,
        pokemon_image: input.pokemon_image,
      })
      .returning("id");

    const createdPokemonId = inserted[0].id; // <-- FIXED
    console.log("CREATED POKEMON ID:", createdPokemonId);

    // Fetch joined Pokémon + category data
    const createdPokemon = await knex("pokemon")
      .join("category", "pokemon.category_id", "category.id")
      .where("pokemon.id", createdPokemonId) // <-- Now correct integer
      .select("pokemon.*", "category.name as category_name")
      .first();

    // Final response shaping
    return {
      ...createdPokemon,
      category_name: category.name,
    };

  } catch (error) {
    throw new Error(`Could not create Pokémon: ${error.message}`);
  }
};
