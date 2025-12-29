import { Graph } from "src/generated/graph";
import ContextType from "src/graphql/ContextType";

export const UpdateTestMutation = async (
  _,
  { id, input }: { id: number; input: Graph.TestInput },
  ctx: ContextType
) => {
  return true;
};
