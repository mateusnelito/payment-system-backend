import { FastifyReply, FastifyRequest } from 'fastify';
import { accountParamsSchema } from '../schemas/account.schema';
import { getAccount } from '../services/account.service';

export async function getAccountController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { accountId } = accountParamsSchema.parse(request.params);

  return reply.send({ status: 'success', data: await getAccount(accountId) });
}
