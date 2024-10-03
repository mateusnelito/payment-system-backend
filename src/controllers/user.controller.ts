import { FastifyReply, FastifyRequest } from 'fastify';
import { createUserSchema } from '../schemas/user.schema';
import {
  checkUserExistence,
  checkUserTypeExistence,
  createUser,
} from '../services/user.service';
import HttpStatusCodes from '../utils/http-status-codes.util';

export async function createUserController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const data = createUserSchema.parse(request.body);
  const { email, BI, userTypeId } = data;

  await Promise.all([
    checkUserExistence(email, BI),
    checkUserTypeExistence(userTypeId),
  ]);

  return reply.status(HttpStatusCodes.CREATED).send(await createUser(data));
}
