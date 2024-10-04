import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import {
  createUserAccountController,
  createUserController,
  getUserController,
} from '../controllers/user.controller';

const userRoute: FastifyPluginAsync = async (server: FastifyInstance) => {
  server.post('/', createUserController);
  server.get('/:userId', getUserController);
  server.post('/:userId/accounts', createUserAccountController);
};

export default userRoute;
