import { FastifyReply, FastifyRequest } from 'fastify';
import { ResponseStatus } from '../constants/response-status.type';
import {
  createUserAccountSchema,
  createUserSchema,
  getUserParamsSchema,
} from '../schemas/user.schema';
import {
  checkUserAccountTypeExistence,
  createAccount,
  getUserAccounts,
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
    .send({ status: ResponseStatus.SUCCESS, data: await createUser(data) });
}

export async function getUserController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { userId } = getUserParamsSchema.parse(request.params);

  return reply.send({
    status: ResponseStatus.SUCCESS,
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
    status: ResponseStatus.SUCCESS,
    data: await createAccount(userId, data),
  });
}

export async function getUserAccountsController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { userId } = getUserParamsSchema.parse(request.params);

  await checkUserId(userId);

  return reply.send({
    status: ResponseStatus.SUCCESS,
    data: await getUserAccounts(userId),
  });
}
