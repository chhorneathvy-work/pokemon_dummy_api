import "dotenv/config";
import type { Knex } from "knex";

// const config: { [key: string]: Knex.Config } = {
//   development: {
//     client: "pg",
//     connection: process.env.DATABASE_URL,
//     migrations: {
//       directory: "./src/db/migrations",
//       extension: "ts",
//       tableName: "knex_migrations",
//     },
//   },

//   production: {
//     client: "pg",
//     connection: process.env.DATABASE_URL,
//     migrations: {
//       directory: "./src/db/migrations",
//       extension: "ts",
//       tableName: "knex_migrations",
//     },
//   },
// };

// export default config;


const config: { [key: string]: Knex.Config } = {
  development: {
    client: "pg",
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: "./src/db/migrations",
      extension: "ts",
      tableName: "knex_migrations",
    },
  },

  production: {
    client: "pg",
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: "./src/db/migrations",
      extension: "ts",
      tableName: "knex_migrations",
    },
  },
}
export default config;
