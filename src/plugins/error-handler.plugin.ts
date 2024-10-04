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
        status: 'fail',
        data: {
          message: 'Input validation error',
          errors: formatZodErrors(err),
          code: HttpStatusCodes.BAD_REQUEST,
        },
      });
    }

    // Client Errors
    if (err instanceof ClientError) {
      const { statusCode: code, message, errors } = err;
      return reply
        .status(code)
        .send({ status: 'fail', data: { message, errors, code } });
    }

    console.error(err);

    return reply.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({
      status: 'fail',
      data: {
        message: 'Internal server error!',
        code: HttpStatusCodes.INTERNAL_SERVER_ERROR,
      },
    });
  });
});
