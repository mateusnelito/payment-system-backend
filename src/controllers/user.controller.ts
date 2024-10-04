import { FastifyReply, FastifyRequest } from 'fastify';
import {
  createUserAccountSchema,
  createUserSchema,
  getUserParamsSchema,
} from '../schemas/user.schema';
import {
  checkUserAccountTypeExistence,
  createAccount,
} from '../services/account.service';
import {
  checkUserExistence,
  checkUserId,
  createUser,
  getUser,
} from '../services/user.service';
import HttpStatusCodes from '../utils/http-status-codes.util';

export async function createUserController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const data = createUserSchema.parse(request.body);
  const { email, bi } = data;

  await checkUserExistence(email, bi);

  return reply
    .status(HttpStatusCodes.CREATED)
    .send({ status: 'success', data: await createUser(data) });
}

export async function getUserController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { userId } = getUserParamsSchema.parse(request.params);

  return reply.send({
    status: 'success',
    data: await getUser(userId),
  });
}

export async function createUserAccountController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { userId } = getUserParamsSchema.parse(request.params);
  const data = createUserAccountSchema.parse(request.body);

  await checkUserId(userId);
  await checkUserAccountTypeExistence(userId, data.type);

  return reply.status(HttpStatusCodes.CREATED).send({
    status: 'success',
    data: await createAccount(userId, data),
  });
}
