import {FastifyInstance, FastifyReply} from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import {
  hasZodFastifySchemaValidationErrors, isResponseSerializationError
} from 'fastify-type-provider-zod';
import { ResponseStatus } from '../constants/response-status.type';
import ClientError from '../utils/client-error.util';
import HttpStatusCodes from '../utils/http-status-codes.util';
import {formatZodValidationErrors} from "../utils/format-zod-validation-errors.util";

function sendServerError(reply: FastifyReply){
  return reply.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({
    status: ResponseStatus.FAIL,
    data: {
      message: 'Internal server error!',
      code: HttpStatusCodes.INTERNAL_SERVER_ERROR,
    },
  });
}

export default fastifyPlugin(async (server: FastifyInstance) => {
  server.setErrorHandler((err, req, reply) => {
    // TODO: Implement logging for all errors

    if (hasZodFastifySchemaValidationErrors(err)) {
      const {validation, validationContext} = err;

      return reply.code(HttpStatusCodes.BAD_REQUEST).send({
        status: ResponseStatus.FAIL,
        data: {
          message: `Invalid ${validationContext} input`,
          errors: formatZodValidationErrors(validation),
          code: HttpStatusCodes.BAD_REQUEST,
        },
      });
    }

    if(isResponseSerializationError(err)){
      console.error(`Error Serializing ${err.validationContext} \n: ${err}`);
      sendServerError(reply)
    }

    // Client Errors
    if (err instanceof ClientError) {
      const { statusCode: code, message, errors } = err;
      return reply
        .status(code)
        .send({ status: ResponseStatus.FAIL, data: { message, errors, code } });
    }

    console.error(err);
    sendServerError(reply)
  });
});
