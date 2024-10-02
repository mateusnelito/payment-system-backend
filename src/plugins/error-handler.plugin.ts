import { FastifyInstance } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import HttpStatusCodes from '../utils/http-status-codes.util';

export default fastifyPlugin(async (server: FastifyInstance) => {
  server.setErrorHandler((err, _, reply) => {
    console.error(err);

    return reply.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({
      statusCode: HttpStatusCodes.INTERNAL_SERVER_ERROR,
      message: 'Internal server error!',
      errors: err,
    });
  });
});
