import { FastifyReply, FastifyRequest } from 'fastify';
import { ResponseStatus } from '../constants/response-status.type';
import {
  createUserDataType,
  getUserParamsDataType,
} from '../schemas/user.schema';
import {
  checkUserExistence,
  createUser,
  getUser,
} from '../services/user.service';
import HttpStatusCodes from '../utils/http-status-codes.util';

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

// export async function createUserAccountController(
//   request: FastifyRequest,
//   reply: FastifyReply
// ) {
//   const { userId } = getUserParamsSchema.parse(request.params);
//   const data = createUserAccountSchema.parse(request.body);
//
//   await checkUserId(userId);
//   await checkUserAccountTypeExistence(userId, data.type);
//
//   return reply.status(HttpStatusCodes.CREATED).send({
//     status: ResponseStatus.SUCCESS,
//     data: await createAccount(userId, data),
//   });
// }
//
// export async function getUserAccountsController(
//   request: FastifyRequest,
//   reply: FastifyReply
// ) {
//   const { userId } = getUserParamsSchema.parse(request.params);
//
//   await checkUserId(userId);
//
//   return reply.send({
//     status: ResponseStatus.SUCCESS,
//     data: await getUserAccounts(userId),
//   });
// }
