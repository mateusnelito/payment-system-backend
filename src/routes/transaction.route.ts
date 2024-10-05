import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import {
  createTransactionController,
  getTransactionController,
} from '../controllers/transaction.controller';

const transactionRoute: FastifyPluginAsync = async (
  server: FastifyInstance
) => {
  server.post('/', createTransactionController);
  server.get('/:transactionId', getTransactionController);
};

export default transactionRoute;
