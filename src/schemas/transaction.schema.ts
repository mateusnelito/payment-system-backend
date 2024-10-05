import z from 'zod';

const transactionSchema = z.object({
  id: z.number().int().positive(),
  fromAccountId: z.string().trim(),
  toAccountId: z.string().trim(),
  amount: z.number().int().positive(),
  createdAt: z.date(),
});

export const createTransactionSchema = transactionSchema.omit({
  id: true,
  createdAt: true,
});

export const getTransactionParamsSchema = z.object({
  transactionId: z.coerce.number().int().positive(),
});

export type createTransactionDataType = z.infer<typeof createTransactionSchema>;
