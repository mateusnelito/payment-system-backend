import fastify from 'fastify';
import corsPlugin from './plugins/cors.plugin';
import errorHandlerPlugin from './plugins/error-handler.plugin';
import routes from './routes/index.route';
import fastifyTypeProviderZodPlugin from "./plugins/fastify-type-provider-zod.plugin";

const server = fastify();

// Register plugins
server.register(corsPlugin);
server.register(fastifyTypeProviderZodPlugin);
server.register(errorHandlerPlugin);

// Register routes
server.register(routes);

// Handle port server port
const SERVER_PORT = Number(process.env.PORT || 3000);

// start server
server
  .listen({ port: SERVER_PORT })
  .then(() => {
    console.log(`🔥 API Running on :${SERVER_PORT}`);
  })
  .catch((err) => {
    console.error(`🛑 Error starting API: \n ${err}`);
    process.exit(1);
  });
