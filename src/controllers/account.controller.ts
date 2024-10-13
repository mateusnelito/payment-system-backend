import { FastifyReply, FastifyRequest } from 'fastify';
import { ResponseStatus } from '../constants/response-status.type';
import { getAccountParamsDataType } from '../schemas/account.schema';
import { checkAccountId, getAccount } from '../services/account.service';
import { getAccountTransactions } from '../services/transaction.service';

export async function getAccountController(
  request: FastifyRequest<{ Params: getAccountParamsDataType }>,
  reply: FastifyReply
) {
  const { accountId } = request.params;

  return reply.send({
    status: ResponseStatus.SUCCESS,
    data: await getAccount(accountId),
  });
}

export async function getAccountTransactionsController(
  request: FastifyRequest<{ Params: getAccountParamsDataType }>,
  reply: FastifyReply
) {
  const { accountId } = request.params;

  await checkAccountId(accountId);

  return reply.send({
    status: ResponseStatus.SUCCESS,
    data: await getAccountTransactions(accountId),
  });
}
