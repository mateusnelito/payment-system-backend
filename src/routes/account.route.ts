import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import {
  getAccountController,
  getAccountTransactionsController,
} from '../controllers/account.controller';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { getAccountSchema } from '../schemas/account.schema';

const accountRoute: FastifyPluginAsync = async (server: FastifyInstance) => {
  // Show
  server.withTypeProvider<ZodTypeProvider>().get('/:accountId', {
    schema: getAccountSchema,
    handler: getAccountController,
  });

  server.get('/:accountId/transactions', getAccountTransactionsController);
};

export default accountRoute;
