import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import {
  createUserAccountController,
  createUserController,
  getUserAccountsController,
  getUserController,
} from '../controllers/user.controller';

const userRoute: FastifyPluginAsync = async (server: FastifyInstance) => {
  server.post('/', createUserController);
  server.get('/:userId', getUserController);
  server.post('/:userId/accounts', createUserAccountController);
  server.get('/:userId/accounts', getUserAccountsController);
};

export default userRoute;
