import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import {
  createUserController,
  getUserController,
} from '../controllers/user.controller';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { createUserSchema, getUserSchema } from '../schemas/user.schema';

const userRoute: FastifyPluginAsync = async (server: FastifyInstance) => {
  // Store
  server.withTypeProvider<ZodTypeProvider>().post('/', {
    schema: createUserSchema,
    handler: createUserController,
  });

  // Show
  server.withTypeProvider<ZodTypeProvider>().get('/:userId', {
    schema: getUserSchema,
    handler: getUserController,
  });
  // server.post('/:userId/accounts', createUserAccountController);
  // server.get('/:userId/accounts', getUserAccountsController);
};

export default userRoute;
