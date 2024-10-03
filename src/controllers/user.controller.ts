import { FastifyReply, FastifyRequest } from 'fastify';
import { createUserSchema } from '../schemas/user.schema';
import { checkAccountTypeExistence } from '../services/account.service';
import { checkUserExistence, createUser } from '../services/user.service';
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
