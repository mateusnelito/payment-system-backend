import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import {
  createUserAccountController,
  createUserController,
  getUserAccountsController,
  getUserController,
} from '../controllers/user.controller';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import {
  createUserAccountSchema,
  createUserSchema,
  getUserAccountsSchema,
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

  // Store User Account
  server.withTypeProvider<ZodTypeProvider>().post('/:userId/accounts', {
    schema: createUserAccountSchema,
    handler: createUserAccountController,
  });

  // Show User Accounts
  server.withTypeProvider<ZodTypeProvider>().get('/:userId/accounts', {
    schema: getUserAccountsSchema,
    handler: getUserAccountsController,
  });
};

export default userRoute;
