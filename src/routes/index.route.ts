import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import HttpStatusCodes from '../utils/http-status-codes.util';

const routes: FastifyPluginAsync = async (server: FastifyInstance) => {
  // Define the 404 route
  server.setNotFoundHandler((request, reply) => {
    return reply.status(HttpStatusCodes.NOT_FOUND).send({
      statusCode: HttpStatusCodes.NOT_FOUND,
      message: 'Route not found',
    });
  });

  // API Routes
};

export default routes;
