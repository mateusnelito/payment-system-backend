import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import {
  createUserAccountController,
  createUserController,
  getUserController,
} from '../controllers/user.controller';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import {
  createUserAccountSchema,
  createUserSchema,
  getUserSchema,
} from '../schemas/user.schema';

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
  server.withTypeProvider<ZodTypeProvider>().post('/:userId/accounts', {
    schema: createUserAccountSchema,
    handler: createUserAccountController,
  });
  // server.get('/:userId/accounts', getUserAccountsController);
};

export default userRoute;
