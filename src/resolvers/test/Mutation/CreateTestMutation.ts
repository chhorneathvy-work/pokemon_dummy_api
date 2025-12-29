import { Graph } from "src/generated/graph";
import ContextType from "src/graphql/ContextType";

export const CreateTestMutation = async (
  _,
  { input }: { input: Graph.TestInput },
  ctx: ContextType
) => {
  return 1;
};
