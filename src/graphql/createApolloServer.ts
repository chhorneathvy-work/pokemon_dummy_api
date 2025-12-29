// import express from "express";
// import http from "http";
// import { ApolloServer } from "@apollo/server";
// import { makeExecutableSchema } from "@graphql-tools/schema";
// import loadMergeSchema from "./loadMergedSchema";
// import AppResolver from "../resolvers/AppResolver";
// import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
// import { ApolloServerPluginLandingPageGraphQLPlayground } from "@apollo/server-plugin-landing-page-graphql-playground";
// import cors from "cors";
// import { expressMiddleware } from "@apollo/server/express4";
// import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
// import { graphqlUploadExpress } from "graphql-upload-minimal";
// import { errorHandler } from "../utils/errorHandler";
// import { createApolloContext } from "./createApolloContext";

// export const app = express();

// export async function startApolloServer() {
//   const PORT = process.env.PORT || 8000;
//   const httpServer = http.createServer(app);
//   const context = createApolloContext();

//   const schema = makeExecutableSchema({
//     typeDefs: loadMergeSchema,
//     resolvers: AppResolver,
//   });

//   const server = new ApolloServer({
//     schema,
//     introspection: true,
//     csrfPrevention: false, // true in production
//     plugins: [
//       // Proper shutdown for the HTTP server.
//       ApolloServerPluginDrainHttpServer({ httpServer }),
//       process.env.NODE_ENV === "production"
//         ? ApolloServerPluginLandingPageGraphQLPlayground()
//         : ApolloServerPluginLandingPageLocalDefault({ footer: false }),
//     ],
//     formatError: errorHandler,
//   });

//   await server.start();

//   app.use(graphqlUploadExpress());

//   app.use(
//     "/pokemon-api/graphql",
//     cors<cors.CorsRequest>(),
//     express.json(),
//     expressMiddleware(server, {
//       context,
//     })
//   );

//   await new Promise<void>((resolve) => {
//     console.log(`🚀 Query endpoint ready at http://localhost:${PORT}/pokemon-api/graphql`);
//     return httpServer.listen({ port: PORT }, resolve);
//   });
// }

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
      ApolloServerPluginLandingPageLocalDefault({ footer: false }),
    ],
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
    console.log(
      `🚀 Query endpoint ready at http://localhost:${PORT}/pokemon-api/graphql`
    );
  });
}
