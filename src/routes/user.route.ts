import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import {
  createUserAccountController,
  createUserController,
  getUserAccountsController,
  getUserController,
} from '../controllers/user.controller';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { createUserSchema } from '../schemas/user.schema';

const userRoute: FastifyPluginAsync = async (server: FastifyInstance) => {
  server.withTypeProvider<ZodTypeProvider>().post('/', {
    schema: createUserSchema,
    handler: createUserController,
  });
  server.get('/:userId', getUserController);
  server.post('/:userId/accounts', createUserAccountController);
  server.get('/:userId/accounts', getUserAccountsController);
};

export default userRoute;
