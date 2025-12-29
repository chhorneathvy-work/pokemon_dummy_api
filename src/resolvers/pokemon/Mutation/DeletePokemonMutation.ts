import ContextType from "src/graphql/ContextType";

export const DeletePokemonMutation = async (
  _,
  { id }: { id: number },
  ctx: ContextType
) => {
  const knex = ctx.knex.default;
  try {
    // Attempt to delete the Pokémon by id
    const delete_pokemon = await knex('pokemon')
      .where('id', id)
      .del();

    // Return true if a Pokémon was deleted (delete_pokemon > 0), otherwise false
    return delete_pokemon > 0;
  } catch (error) {
    throw new Error(`Could not delete Pokémon: ${error.message}`);
  }
};

export default DeletePokemonMutation;
