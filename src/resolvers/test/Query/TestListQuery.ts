import ContextType from "src/graphql/ContextType";

export const TestListQuery = async (_, {}: {}, ctx: ContextType) => {
  return ["test 1", "test 2", "test 3"];
};
