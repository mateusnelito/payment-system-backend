import { FastifyReply, FastifyRequest } from 'fastify';
import { ResponseStatus } from '../constants/response-status.type';
import {
  createTransactionDataType,
  transactionParamsDataType,
} from '../schemas/transaction.schema';
import { sendNotification } from '../services/notification.service';
import {
  createTransaction,
  getTransaction,
  validateTransaction,
} from '../services/transaction.service';
import HttpStatusCodes from '../utils/http-status-codes.util';

export async function createTransactionController(
  request: FastifyRequest<{ Body: createTransactionDataType }>,
  reply: FastifyReply
) {
  const data = request.body;

  const validatedTransaction = await validateTransaction(data);
  const transaction = await createTransaction(validatedTransaction);

  reply.status(HttpStatusCodes.CREATED).send({
    status: ResponseStatus.SUCCESS,
    data: transaction,
  });

  await sendNotification();
}

export async function getTransactionController(
  request: FastifyRequest<{ Params: transactionParamsDataType }>,
  reply: FastifyReply
) {
  const { transactionId } = request.params;

  return reply.send({
    status: ResponseStatus.SUCCESS,
    data: await getTransaction(transactionId),
  });
}
