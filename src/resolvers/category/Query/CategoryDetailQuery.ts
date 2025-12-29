import ContextType from "src/graphql/ContextType"

export const categoryDetailQuery =async (_,{ id }, ctx: ContextType) => {
  const knex = ctx.knex.default;

  try {
    const categoryDetail = await knex('category').where({ id }).first();
    return categoryDetail;

  } catch (error) {
    throw new Error(`Could not fetch category: ${error.message}`);
  }

};
export default categoryDetailQuery;