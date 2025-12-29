// import createKnexContext from "./createKnexContext";
// import extractRequestToken from "./extractRequestToken";
// import { getUser } from "../middlewares/Authentication";

// export interface AuthUserInterface {
//   id?: number;
//   token?: string;
// }

// export function createApolloContext() {
//   const knexConnectionList = createKnexContext();

//   return async ({ req }: any) => {
//     const token: string = extractRequestToken(req);

//     return {
//       user: await getUser(token),
//       knex: knexConnectionList,
//       token,
//     };
//   };
// }

import createKnexContext from "./createKnexContext";
import extractRequestToken from "./extractRequestToken";
import { getUser } from "../middlewares/Authentication";

export function createApolloContext() {
  const knexConnectionList = createKnexContext();

  return async ({ req }: any) => {
    const token = extractRequestToken(req);

    return {
      user: await getUser(token),
      knex: knexConnectionList,
      token,
    };
  };
}
