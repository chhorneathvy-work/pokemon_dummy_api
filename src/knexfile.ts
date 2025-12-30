import "dotenv/config";
import path from "path";
import type { Knex } from "knex";

const isProd = process.env.NODE_ENV === "production";

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "pg",
    connection: process.env.DATABASE_URL ?? process.env.DATABASE_PUBLIC_URL,
    migrations: {
      directory: path.resolve(__dirname, "../migrations"),
      extension: "ts",
    },
  },

  production: {
    client: "pg",
    connection: process.env.DATABASE_URL ?? process.env.DATABASE_PUBLIC_URL,
    migrations: {
      directory: path.resolve(__dirname, "migrations"),
      extension: "js",
    },
    pool: { min: 2, max: 10 },
  },
};
export default config;
