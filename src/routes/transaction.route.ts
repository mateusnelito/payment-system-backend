import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import {
  createTransactionController,
  getTransactionController,
} from '../controllers/transaction.controller';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import {
  createTransactionSchema,
  getTransactionSchema,
} from '../schemas/transaction.schema';

const transactionRoute: FastifyPluginAsync = async (
  server: FastifyInstance
) => {
  // Store
  server.withTypeProvider<ZodTypeProvider>().post('/', {
    schema: createTransactionSchema,
    handler: createTransactionController,
  });

  // Show
  server.withTypeProvider<ZodTypeProvider>().get('/:transactionId', {
    schema: getTransactionSchema,
    handler: getTransactionController,
  });
};

export default transactionRoute;
