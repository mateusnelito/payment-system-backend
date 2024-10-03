import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { createUserController } from '../controllers/user.controller';

const userRoute: FastifyPluginAsync = async (server: FastifyInstance) => {
  server.post('/', createUserController);
};

export default userRoute;
