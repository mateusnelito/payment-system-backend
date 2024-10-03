import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import {
  createUserController,
  getUserController,
} from '../controllers/user.controller';

const userRoute: FastifyPluginAsync = async (server: FastifyInstance) => {
  server.post('/', createUserController);
  server.get('/:userId', getUserController);
};

export default userRoute;
