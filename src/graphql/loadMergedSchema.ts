import { gql } from "graphql-tag";
import * as fs from "fs";
import * as path from "path";

export default function loadMergeSchema() {
  const schemaPath =
    process.env.NODE_ENV === "production"
      ? path.join(__dirname, "../schema")   // dist/schema
      : path.join(process.cwd(), "src/schema");

  const files = fs.readdirSync(schemaPath).sort();

  return files.map(file =>
    gql`${fs.readFileSync(path.join(schemaPath, file), "utf8")}`
  );
}
