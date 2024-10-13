import { FastifyReply, FastifyRequest } from 'fastify';
import { ResponseStatus } from '../constants/response-status.type';
import {
  createUserAccountDataType,
  createUserDataType,
  getUserParamsDataType,
} from '../schemas/user.schema';
import {
  checkUserExistence,
  checkUserId,
  createUser,
  getUser,
} from '../services/user.service';
import HttpStatusCodes from '../utils/http-status-codes.util';
import {
  checkUserAccountTypeExistence,
  createAccount,
  getUserAccounts,
} from '../services/account.service';

export async function createUserController(
  request: FastifyRequest<{ Body: createUserDataType }>,
  reply: FastifyReply
) {
  const { email, bi } = request.body;

  await checkUserExistence(email, bi);

  return reply.status(HttpStatusCodes.CREATED).send({
    status: ResponseStatus.SUCCESS,
    data: await createUser(request.body),
  });
}

export async function getUserController(
  request: FastifyRequest<{ Params: getUserParamsDataType }>,
  reply: FastifyReply
) {
  const { userId } = request.params;

  return reply.send({
    status: ResponseStatus.SUCCESS,
    data: await getUser(userId),
  });
}

export async function createUserAccountController(
  request: FastifyRequest<{
    Params: getUserParamsDataType;
    Body: createUserAccountDataType;
  }>,
  reply: FastifyReply
) {
  const { userId } = request.params;
  const data = request.body;

  await checkUserId(userId);
  await checkUserAccountTypeExistence(userId, data.type);

  return reply.status(HttpStatusCodes.CREATED).send({
    status: ResponseStatus.SUCCESS,
    data: await createAccount(userId, data),
  });
}

export async function getUserAccountsController(
  request: FastifyRequest<{ Params: getUserParamsDataType }>,
  reply: FastifyReply
) {
  const { userId } = request.params;

  await checkUserId(userId);

  return reply.send({
    status: ResponseStatus.SUCCESS,
    data: await getUserAccounts(userId),
  });
}
