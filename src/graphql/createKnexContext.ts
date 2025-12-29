// import knex from "knex";

// export default function createKnexContext() {
//   return {
//     default: knex({
//       client: "mysql2",
//       connection: process.env.MYSQL_DEFAULT,
//       pool: { min: 3, max: 10 },
//     }),
//   };
// }

import knex from "knex";
import config from "../../knexfile";

export default function createKnexContext() {
  const env =
    process.env.NODE_ENV === "production" ? "production" : "development";

  const db = knex(config[env]);

  return {
    default: db,
  };
}
