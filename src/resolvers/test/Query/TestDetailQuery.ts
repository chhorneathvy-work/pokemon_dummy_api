import ContextType from "src/graphql/ContextType";

export const TestDetailQuery = async (
  _,
  { id }: { id: number },
  ctx: ContextType
) => {
  return "test " + id;
};
