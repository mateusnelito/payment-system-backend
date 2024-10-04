import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { getAccountController } from '../controllers/account.controller';

const accountRoute: FastifyPluginAsync = async (server: FastifyInstance) => {
  server.get('/:accountId', getAccountController);
};

export default accountRoute;
