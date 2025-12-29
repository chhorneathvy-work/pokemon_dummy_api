import ContextType from "src/graphql/ContextType";

export const pokemonDetailQuery = async (_, { id }, ctx: ContextType) => {
  const knex = ctx.knex.default;

  try {
    // Perform a join with the category table to get the category name
    const pokemonDetail = await knex("pokemon")
      .join("category", "pokemon.category_id", "=", "category.id")
      .where("pokemon.id", id)
      .select("pokemon.*", "category.name as category_name")
      .first();

    // This will include an additional 'category_name' property in the result
    return pokemonDetail;
  } catch (error) {
    throw new Error(`Could not fetch Pokémon details: ${error.message}`);
  }
};
