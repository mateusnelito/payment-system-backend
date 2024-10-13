import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import {
  getAccountController,
  getAccountTransactionsController,
} from '../controllers/account.controller';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import {
  getAccountSchema,
  getAccountTransactionsSchema,
} from '../schemas/account.schema';

const accountRoute: FastifyPluginAsync = async (server: FastifyInstance) => {
  // Show
  server.withTypeProvider<ZodTypeProvider>().get('/:accountId', {
    schema: getAccountSchema,
    handler: getAccountController,
  });

  // Show Account Transactions
  server.withTypeProvider<ZodTypeProvider>().get('/:accountId/transactions', {
    schema: getAccountTransactionsSchema,
    handler: getAccountTransactionsController,
  });
};

export default accountRoute;
