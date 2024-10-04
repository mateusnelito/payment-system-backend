import { FastifyReply, FastifyRequest } from 'fastify';
import { createTransactionSchema } from '../schemas/transaction.schema';
import {
  createTransaction,
  validateTransaction,
} from '../services/transaction.service';
import HttpStatusCodes from '../utils/http-status-codes.util';

export async function createTransactionController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const data = createTransactionSchema.parse(request.body);

  const validatedTransaction = await validateTransaction(data);
  const transaction = await createTransaction(validatedTransaction);

  // TODO: Send a notification

  return reply.status(HttpStatusCodes.CREATED).send({
    status: 'success',
    data: transaction,
  });
}
