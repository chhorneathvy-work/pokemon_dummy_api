import ContextType from "src/graphql/ContextType";

export const pokemonListQuery = async (
  _,
  { categoryId = null, page = 1, limit = 10, search = null },
  ctx: ContextType
) => {
  const knex = ctx.knex.default;

  try {
    // Make sure page and limit are integers
    page = Number(page) || 1;
    limit = Number(limit) || 10;

    const offset = (page - 1) * limit;

    // Base query
    const query = knex("pokemon")
      .join("category", "pokemon.category_id", "=", "category.id")
      .select(
        "pokemon.id",
        "pokemon.category_id",
        "category.name as category_name",
        "pokemon.pokemon_name",
        "pokemon.pokemon_description",
        "pokemon.pokemon_image"
      )
      .limit(limit)
      .offset(offset);

    // Optional category filter
    if (categoryId) {
      query.where("pokemon.category_id", categoryId);
    }

    if (search){
      query.whereILike("pokemon.pokemon_name", `%${search}%`);
    }

    const result = await query;

    // MUST return an array to avoid GraphQL errors
    return Array.isArray(result) ? result : [];
  } catch (error) {
    console.error("PokemonListQuery Error:", error);
    return []; // return empty array instead of null
  }
};

