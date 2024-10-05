import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import {
  getAccountController,
  getAccountTransactionsController,
} from '../controllers/account.controller';

const accountRoute: FastifyPluginAsync = async (server: FastifyInstance) => {
  server.get('/:accountId', getAccountController);
  server.get('/:accountId/transactions', getAccountTransactionsController);
};

export default accountRoute;
