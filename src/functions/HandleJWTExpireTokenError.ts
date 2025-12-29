import { GraphQLError } from "graphql";

export function HandleJWTExpireTokenError(error: any) {
  const context = error.toString().split(" ");
  if (context[0] === "TokenExpiredError") {
    throw new GraphQLError(`Your session was ${context[2]}`);
  }
}
