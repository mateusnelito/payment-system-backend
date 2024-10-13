import fastifyPlugin from 'fastify-plugin';
import { FastifyInstance } from 'fastify';
import fastifySwagger from '@fastify/swagger';
import { jsonSchemaTransform } from 'fastify-type-provider-zod';
import fastifySwaggerUi from '@fastify/swagger-ui';

export default fastifyPlugin(async (server: FastifyInstance) => {
  server.register(fastifySwagger, {
    swagger: {
      consumes: ['application/json'],
      produces: ['application/json'],
      info: {
        title: 'payment-system',
        // TODO: Improve this
        description: 'lorem ipsum',
        version: '1.0.0',
      },
      tags: [],
    },
    transform: jsonSchemaTransform,
  });

  server.register(fastifySwaggerUi, {
    prefix: '/swagger',
  });
});
