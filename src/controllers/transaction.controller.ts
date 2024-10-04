import { FastifyReply, FastifyRequest } from 'fastify';
import { ResponseStatus } from '../constants/response-status.type';
import { createTransactionSchema } from '../schemas/transaction.schema';
import {
  createTransaction,
  validateTransaction,
} from '../services/transaction.service';
import HttpStatusCodes from '../utils/http-status-codes.util';
import { sendNotification } from '../services/notification.service';

export async function createTransactionController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const data = createTransactionSchema.parse(request.body);

  const validatedTransaction = await validateTransaction(data);
  const transaction = await createTransaction(validatedTransaction);

  reply.status(HttpStatusCodes.CREATED).send({
    status: ResponseStatus.SUCCESS,
    data: transaction,
  });

  await sendNotification();
}
