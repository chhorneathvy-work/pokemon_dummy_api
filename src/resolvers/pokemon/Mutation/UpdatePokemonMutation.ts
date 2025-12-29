import { Graph } from "src/generated/graph";
import ContextType from "src/graphql/ContextType";

export const UpdatePokemonMutation = async (
  _,
  { id, input }: { id: number; input: Graph.UpdatePokemonInput },
  ctx: ContextType
) => {
  const knex = ctx.knex.default;
  try {
    const { category_name, pokemon_name, pokemon_description, pokemon_image } = input;

    // Find the category ID based on the provided category name.
    const category = await knex("category")
      .where({ name: category_name })
      .first();

    if (!category) {
      throw new Error(`Category "${category_name}" does not exist.`);
    }

    const update_pokemon = await knex("pokemon")
      .where({ id })
      .update({
        category_id: category.id,
        pokemon_name,
        pokemon_description,
        pokemon_image,
      });

    if (update_pokemon > 0) {
      // Fetch the updated Pokémon along with its category name
      const updatedPokemon = await knex("pokemon")
        .join("category", "pokemon.category_id", "category.id")
        .where("pokemon.id", id)
        .select(
          "pokemon.id",
          "pokemon.category_id",
          "pokemon.pokemon_name",
          "pokemon.pokemon_description",
          "pokemon.pokemon_image",
          "category.name as category_name" // Include the category_name in the selection
        )
        .first();

      if (!updatedPokemon) {
        throw new Error("Failed to fetch updated Pokémon.");
      }

      return updatedPokemon;
    } else {
      throw new Error("No Pokémon was updated."); // Updated to throw an error instead of returning null
    }
  } catch (error) {
    throw new Error(`Could not update Pokémon: ${error.message}`);
  }
};
