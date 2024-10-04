import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import HttpStatusCodes from '../utils/http-status-codes.util';
import accountRoute from './account.route';
import userRoute from './user.route';
import transactionRoute from './transaction.route';

const routes: FastifyPluginAsync = async (server: FastifyInstance) => {
  // Define the 404 route
  server.setNotFoundHandler((request, reply) => {
    return reply.status(HttpStatusCodes.NOT_FOUND).send({
      statusCode: HttpStatusCodes.NOT_FOUND,
      message: 'Route not found',
    });
  });

  // API Routes
  server.register(userRoute, { prefix: '/api/users' });
  server.register(accountRoute, { prefix: '/api/accounts' });
  server.register(transactionRoute, { prefix: '/api/transactions' });
};

export default routes;
