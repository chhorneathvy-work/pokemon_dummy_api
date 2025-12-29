import * as fs from "fs";
import { createConnection } from "mysql2/promise";

import dotenv from "dotenv";
import { getCurrentDatabaseName } from "./generate_table";
import { generateType } from "./generate_graph_type";
dotenv.config();

const RESOLVER_PATH = "./src/resolvers/";
const SCHEMA_PATH = "./src/schema/";

type InformationSchemaType = {
  COLUMN_NAME: string;
  COLUMN_TYPE: string;
  DATA_TYPE: string;
  IS_NULLABLE: "YES" | "NO";
};

function generateTableTypeScriptCode(
  name: string,
  columns: InformationSchemaType[]
): string {
  const map = {
    varchar: "String",
    text: "String",
    int: "Int",
    tinyint: "Boolean",
    bigint: "Int",
    date: "String",
    datetime: "String",
    decimal: "String",
    mediumtext: "String",
    longtext: "String",
    timestamp: "Int",
    json: "JSON",
  };

  let result = `type ${tokenize(name)} {`;

  for (const column of columns) {
    let type = "";

    if (column.DATA_TYPE === "enum") {
      type = column.COLUMN_TYPE.slice(5, column.COLUMN_TYPE.length - 1)
        .split(",")
        .join(" | ");
    } else {
      type = map[column.DATA_TYPE];
      // if (column.IS_NULLABLE === "YES") type += " | null";
    }

    result += "\r";
    result += `  ${column.COLUMN_NAME}: ${type}`;
  }

  return result + "\r}\r";
}

function generateInputSchema(
  name: string,
  columns: InformationSchemaType[]
): string {
  const map = {
    varchar: "String",
    text: "String",
    int: "Int",
    tinyint: "Boolean",
    bigint: "Int",
    date: "String",
    datetime: "String",
    decimal: "String",
    mediumtext: "String",
    longtext: "String",
    timestamp: "Int",
    json: "JSON",
  };

  let result = `input ${tokenize(name)}Input {`;

  for (const column of columns) {
    if (
      column.COLUMN_NAME === "id" ||
      column.COLUMN_NAME === "created_at" ||
      column.COLUMN_NAME === "updated_at"
    ) {
    } else {
      let type = "";

      if (column.DATA_TYPE === "enum") {
        type = column.COLUMN_TYPE.slice(5, column.COLUMN_TYPE.length - 1)
          .split(",")
          .join(" | ");
      } else {
        type = map[column.DATA_TYPE];
        // if (column.IS_NULLABLE === "YES") type += " | null";
      }

      result += "\r";
      result += `  ${column.COLUMN_NAME}: ${type}`;
    }
  }

  return result + "\r}\r";
}

function capitalize(name: string) {
  if (name.length > 0) {
    return name[0].toUpperCase() + name.substring(1);
  }

  return name;
}

function tokenize(name: string) {
  if (name.length > 0) {
    const split_name = name?.split("_");
    let tokenize_name = "";
    for (const x of split_name) {
      tokenize_name += capitalize(x);
    }
    return tokenize_name;
  }

  return name;
}

function tokenize_schema(name: string) {
  if (name.length > 0) {
    const split_name = name?.split("_");
    let tokenize_name = "";
    let y = 0;
    for (const x of split_name) {
      if (y === 0) {
        tokenize_name += x;
      } else {
        tokenize_name += capitalize(x);
      }

      y++;
    }
    return tokenize_name;
  }

  return name;
}

function generateQuery(dir: string, name: string) {
  let result_list =
    'import { Graph } from "src/generated/graph";\r' +
    'import ContextType from "src/graphql/ContextType";\r\r' +
    `export const ${tokenize(
      name
    )}ListQuery = async (_, {}, ctx: ContextType) => {` +
    "\r\t" +
    "const knex = ctx.knex.default;" +
    "\r\t" +
    `const ${name}_list = await knex.table("${name}");` +
    "\r\t" +
    "return " +
    name +
    "_list" +
    "\r";

  result_list += "}\r";

  let result_detail =
    'import { Graph } from "src/generated/graph";\r' +
    'import ContextType from "src/graphql/ContextType";\r\r' +
    `export const ${tokenize(
      name
    )}DetailQuery = async (_, {id}: { id: number }, ctx: ContextType) => {` +
    "\r\t" +
    "const knex = ctx.knex.default;" +
    "\r\t" +
    `const ${name}_detail = await knex.table("${name}").where({ id }).first();` +
    "\r\t" +
    "return " +
    name +
    "_detail" +
    "\r";

  result_detail += "}\r";

  // const generatedQueryCode = generateQuery(name);
  fs.writeFileSync(dir + `/${tokenize(name)}ListQuery.ts`, result_list);
  fs.writeFileSync(dir + `/${tokenize(name)}DetailQuery.ts`, result_detail);
}

function generateMutation(dir: string, name: string) {
  let result_create =
    'import { Graph } from "src/generated/graph";\r' +
    'import ContextType from "src/graphql/ContextType";\r\r' +
    `export const Create${tokenize(
      name
    )}Mutation = async (_, { input }: { input: Graph.${tokenize(
      name
    )}Input }, ctx: ContextType) => {` +
    "\r\t" +
    "const knex = ctx.knex.default;" +
    "\r\t" +
    `const [create_${name}] = await knex.table("${name}").insert({ ...input });` +
    "\r\t" +
    "return " +
    "create_" +
    name +
    "\r";

  result_create += "}\r";

  let result_update =
    'import { Graph } from "src/generated/graph";\r' +
    'import ContextType from "src/graphql/ContextType";\r\r' +
    `export const Update${tokenize(
      name
    )}Mutation = async (_, {id, input}: { id: number, input: Graph.${tokenize(
      name
    )}Input }, ctx: ContextType) => {` +
    "\r\t" +
    "const knex = ctx.knex.default;" +
    "\r\t" +
    `const update_${name} = await knex.table("${name}").where({ id }).update({ ...input }).first();` +
    "\r\t" +
    "return " +
    "update_" +
    name +
    "\r";

  result_update += "}\r";

  // const generatedQueryCode = generateQuery(name);
  fs.writeFileSync(dir + `/Create${tokenize(name)}Mutation.ts`, result_create);
  fs.writeFileSync(dir + `/Update${tokenize(name)}Mutation.ts`, result_update);
}

function generateSchema(name: string, columns: InformationSchemaType[]) {
  let result = "extend type Query {" + "\r";
  result +=
    "\t" + tokenize_schema(name) + "List: " + `[${tokenize(name)}]` + "\r";
  result +=
    "\t" + tokenize_schema(name) + "Detail(id: Int!): " + tokenize(name) + "\r";
  result += "}" + "\r\r";
  result += "extend type Mutation {" + "\r";
  result +=
    "\t" +
    "create" +
    tokenize(name) +
    `(input: ${tokenize(name)}Input): ` +
    "Int!" +
    "\r";
  result +=
    "\t" +
    "update" +
    tokenize(name) +
    `(id: Int!, input: ${tokenize(name)}Input): ` +
    "Boolean" +
    "\r";
  result += "}" + "\r\r";

  const script = generateTableTypeScriptCode(name, columns);
  result += script + "\r";
  const scriptInput = generateInputSchema(name, columns);
  result += scriptInput;

  return result;
}

async function generate_scaffold(name): Promise<void> {
  const conn = await createConnection(`${process.env.MYSQL_DEFAULT}`);

  const sql =
    "SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?;";

  const db = await getCurrentDatabaseName(conn);

  const rows = (
    await conn.query(sql, [db, name])
  )[0] as unknown as InformationSchemaType[];

  if (!rows) {
    return console.log("table doesn't exist!");
  }

  const re_dir = RESOLVER_PATH + name;

  if (!fs.existsSync(re_dir)) {
    fs.mkdirSync(re_dir);

    !fs.existsSync(re_dir + "/Query") && fs.mkdirSync(re_dir + "/Query");
    !fs.existsSync(re_dir + "/Mutation") && fs.mkdirSync(re_dir + "/Mutation");
  }

  generateQuery(re_dir + "/Query", name);
  generateMutation(re_dir + "/Mutation", name);
  const generatedSchemaCode = generateSchema(name, rows);
  fs.writeFileSync(SCHEMA_PATH + `/${name}.gql`, generatedSchemaCode);
}

async function remove(name: string): Promise<void> {
  const re_dir = RESOLVER_PATH + name;

  fs.existsSync(re_dir) && fs.rmSync(re_dir, { recursive: true, force: true });
  fs.existsSync(SCHEMA_PATH + `/${name}.gql`) &&
    fs.rmSync(SCHEMA_PATH + `/${name}.gql`);
}

async function commandHook() {
  return new Promise((resolve, reject) => {
    try {
      const result = generateType();
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}

function main(): void {
  const args = process.argv;
  const command = args[2] ? args[2].toLowerCase() : "";

  if (command === "add") {
    generate_scaffold(args[3]).then(() => {
      commandHook().then(() => {
        process.exit(0);
      });
    });
  } else if (command === "remove") {
    remove(args[3]).then(() => {
      commandHook().then(() => {
        process.exit(0);
      });
    });
  } else if (command === "update") {
    console.log("update");
  } else {
    console.log("help");
  }
}

main();
