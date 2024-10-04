import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { createTransactionController } from '../controllers/transaction.controller';

const transactionRoute: FastifyPluginAsync = async (
  server: FastifyInstance
) => {
  server.post('/', createTransactionController);
};

export default transactionRoute;
