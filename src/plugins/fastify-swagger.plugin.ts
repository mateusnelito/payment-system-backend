import fastifyPlugin from 'fastify-plugin';
import { FastifyInstance } from 'fastify';
import fastifySwagger from '@fastify/swagger';
import { jsonSchemaTransform } from 'fastify-type-provider-zod';
import fastifySwaggerUi from '@fastify/swagger-ui';

export default fastifyPlugin(async (server: FastifyInstance) => {
  server.register(fastifySwagger, {
    swagger: {
      info: {
        title: 'Payment System API',
        description:
          'A simple server API for managing user accounts, processing transactions, and tracking balances.',
        version: '1.0.0',
      },

      // TODO: make the host dynamic
      host: 'localhost:3000',
      schemes: ['http'],
      consumes: ['application/json'],
      produces: ['application/json'],
      tags: [
        {
          name: 'users',
          description:
            'Endpoints for creating, retrieving, and managing user profiles and their associated accounts.',
        },
        {
          name: 'accounts',
          description:
            'Endpoints for managing user accounts, including creation, retrieval, and balance tracking.',
        },
      ],
    },
    transform: jsonSchemaTransform,
  });

  server.register(fastifySwaggerUi, {
    prefix: '/swagger',
  });
});
