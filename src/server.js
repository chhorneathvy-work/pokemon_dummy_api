import dotenv from "dotenv";
import { startApolloServer } from "./graphql/createApolloServer";

dotenv.config();

startApolloServer();
