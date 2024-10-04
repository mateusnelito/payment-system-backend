import { FastifyReply, FastifyRequest } from 'fastify';
import { ResponseStatus } from '../constants/response-status.type';
import { accountParamsSchema } from '../schemas/account.schema';
import { getAccount } from '../services/account.service';

export async function getAccountController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { accountId } = accountParamsSchema.parse(request.params);

  return reply.send({
    status: ResponseStatus.SUCCESS,
    data: await getAccount(accountId),
  });
}
