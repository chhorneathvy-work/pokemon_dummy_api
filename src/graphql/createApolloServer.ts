import express from "express";
import http from "http";
import { ApolloServer } from "@apollo/server";
import { makeExecutableSchema } from "@graphql-tools/schema";
import loadMergeSchema from "./loadMergedSchema";
import AppResolver from "../resolvers/AppResolver";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import cors from "cors";
import { expressMiddleware } from "@apollo/server/express4";
import { graphqlUploadExpress } from "graphql-upload-minimal";
import { errorHandler } from "../utils/errorHandler";
import { createApolloContext } from "./createApolloContext";

export const app = express();

export async function startApolloServer() {
  const PORT = process.env.PORT || 8000;

  const httpServer = http.createServer(app);
  const context = createApolloContext();

  const schema = makeExecutableSchema({
    typeDefs: loadMergeSchema(),
    resolvers: AppResolver,
  });

  const server = new ApolloServer({
    schema,
    introspection: true,
    csrfPrevention: false,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      process.env.NODE_ENV === "production"
        ? undefined
        : ApolloServerPluginLandingPageLocalDefault({ footer: false }),
    ].filter(Boolean),
    formatError: errorHandler,
  });

  await server.start();

  app.use(graphqlUploadExpress());

  app.use(
    "/pokemon-api/graphql",
    cors(),
    express.json(),
    expressMiddleware(server, { context })
  );

  httpServer.listen(PORT, () => {
    const host = process.env.RAILWAY_PUBLIC_DOMAIN
      ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}/pokemon-api/graphql`
      : `http://localhost:${PORT}/pokemon-api/graphql`;

    console.log(`🚀 Query endpoint ready at ${host}`);
  });
}
