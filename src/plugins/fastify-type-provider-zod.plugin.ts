import { FastifyInstance } from 'fastify';
import { fastifyPlugin } from 'fastify-plugin';
import {
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';

export default fastifyPlugin(async (server: FastifyInstance) => {
  server.setValidatorCompiler(validatorCompiler);
  server.setSerializerCompiler(serializerCompiler);
});
