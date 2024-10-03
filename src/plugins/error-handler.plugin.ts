import { FastifyInstance } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import HttpStatusCodes from '../utils/http-status-codes.util';
import { ZodError } from 'zod';
import formatZodErrors from '../utils/format-zod-errors.util';
import ClientError from '../utils/client-error.util';

export default fastifyPlugin(async (server: FastifyInstance) => {
  server.setErrorHandler((err, _, reply) => {
    // Validation errors
    if (err instanceof ZodError) {
      return reply.status(HttpStatusCodes.BAD_REQUEST).send({
        message: 'Input validation error',
        errors: formatZodErrors(err),
      });
    }

    // Client Errors
    if (err instanceof ClientError) {
      const { statusCode, message, errors } = err;
      return reply.status(statusCode).send({ message, errors });
    }

    console.error(err);

    return reply.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({
      statusCode: HttpStatusCodes.INTERNAL_SERVER_ERROR,
      message: 'Internal server error!',
    });
  });
});
