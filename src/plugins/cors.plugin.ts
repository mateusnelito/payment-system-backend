import fastifyPlugin from 'fastify-plugin';
import { FastifyInstance } from 'fastify';
import fastifyCors from '@fastify/cors';

export default fastifyPlugin(async (server: FastifyInstance) => {
  const ALLOWED_ORIGINS = ['*'];

  server.register(fastifyCors, {
    origin: ALLOWED_ORIGINS,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  });
});
