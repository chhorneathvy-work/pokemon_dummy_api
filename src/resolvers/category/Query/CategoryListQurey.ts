// import ContextType from "src/graphql/ContextType"

// export const categoryListQuery =async (_, {}, ctx: ContextType) => {
//   const knex = ctx.knex.default;

//   const CategoryList = await knex.table('category');

//   return CategoryList;
// };

import ContextType from "src/graphql/ContextType";

export const categoryListQuery = async (_: any, __: any, ctx: ContextType) => {
  const knex = ctx.knex.default;

  const rows = await knex("category").select("*");

  return rows.map(r => ({
    id: r.id,
    name: r.name,
    created_at: r.created_at,
    updated_at: r.updated_at,
  }));
};
