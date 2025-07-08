// first import .env
import "dotenv/config";
import cors from "cors";
import express from "express";
import http from "http";
import path from "path";
import pkg from "body-parser";
import resolvers from "./resolvers.js";
import * as jose from "jose";
import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { expressMiddleware } from "@apollo/server/express4";
import { fileURLToPath } from "url";
import { readFileSync } from "fs";
import { PrismaClient } from "@prisma/client";
import { UserTokenManager } from "./userTokenManager.js";
import { PasswordHasher } from "./passwordHasher.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const port = process.env.PORT || 4000;
const app = express();
const prisma = new PrismaClient();
// setup token manager
const alg = "RS256";
const privateKey = await jose.importPKCS8(process.env.PRIVATE_KEY, alg);
const publicKey = await jose.importSPKI(process.env.PUBLIC_KEY, alg);
const tokenManager = new UserTokenManager(prisma, alg, privateKey, publicKey);
const hasher = new PasswordHasher(parseInt(process.env.SALT_ROUNDS));
const typeDefs = readFileSync("../schema.graphql", { encoding: "utf-8" });
const getDynamicContext = async (req) => {
    const token = req.headers?.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.substring(7)
        : undefined;
    const user = token ? await tokenManager.getUser(token) : undefined;
    return {
        user,
        prisma,
        passwordHasher: hasher,
        userTokenManager: tokenManager,
    };
};
// Template code from https://www.apollographql.com/docs/apollo-server/migration#migrate-from-apollo-server-express
const httpServer = http.createServer(app);
const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    introspection: true,
});
await server.start();
// add apollo middleware
app.use("/graphql", cors(), pkg.json(), expressMiddleware(server, {
    context: async ({ req }) => await getDynamicContext(req),
}));
// add static middleware
app.use(express.static(path.join(__dirname, "dist")));
await new Promise((resolve) => httpServer.listen({ port: port }, resolve));
console.log(`🚀 Server ready at http://localhost:${port}/graphql`);
console.log(prisma.user.fields);
