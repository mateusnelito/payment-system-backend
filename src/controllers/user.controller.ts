import { FastifyReply, FastifyRequest } from 'fastify';
import { createUserSchema, getUserSchema } from '../schemas/user.schema';
import { checkAccountTypeExistence } from '../services/account.service';
import {
  checkUserExistence,
  createUser,
  getUser,
} from '../services/user.service';
import HttpStatusCodes from '../utils/http-status-codes.util';

export async function createUserController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const data = createUserSchema.parse(request.body);
  const {
    email,
    BI,
    account: { accountTypeId },
  } = data;

  await Promise.all([
    checkUserExistence(email, BI),
    checkAccountTypeExistence(accountTypeId),
  ]);

  return reply.status(HttpStatusCodes.CREATED).send(await createUser(data));
}

export async function getUserController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const data = getUserSchema.parse(request.params);
  const { userId } = data;

  return reply.send(await getUser(userId));
}
