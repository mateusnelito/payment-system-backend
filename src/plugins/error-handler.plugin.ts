import { FastifyInstance } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import { ZodError } from 'zod';
import { ResponseStatus } from '../constants/response-status.type';
import ClientError from '../utils/client-error.util';
import formatZodErrors from '../utils/format-zod-errors.util';
import HttpStatusCodes from '../utils/http-status-codes.util';

export default fastifyPlugin(async (server: FastifyInstance) => {
  server.setErrorHandler((err, _, reply) => {
    // TODO: Implement logging for all errors

    // Validation errors
    if (err instanceof ZodError) {
      return reply.status(HttpStatusCodes.BAD_REQUEST).send({
        status: ResponseStatus.FAIL,
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
        .send({ status: ResponseStatus.FAIL, data: { message, errors, code } });
    }

    console.error(err);

    return reply.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({
      status: ResponseStatus.FAIL,
      data: {
        message: 'Internal server error!',
        code: HttpStatusCodes.INTERNAL_SERVER_ERROR,
      },
    });
  });
});
