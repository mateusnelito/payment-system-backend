import z from 'zod';
import { transactionSchema } from './transaction.schema';

export const accountSchema = z.object({
  id: z.string().trim().nanoid(),
  userId: z.string().trim(),
  type: z.enum(['MERCHANT', 'COMMON'], {
    message: 'must be MERCHANT or COMMON',
  }),
  initialBalance: z.number().int().nonnegative().optional(),
  createdAt: z.date(),
});

const accountParamsSchema = z.object({
  accountId: z.string().trim().nanoid(),
});

export const getAccountSchema = {
  summary: 'Retrieves details of the specified account, including balance.',
  tags: ['accounts'],
  params: accountParamsSchema,
  response: {
    200: z.object({
      status: z.string().default('success'),
      data: accountSchema.omit({ userId: true, initialBalance: true }).extend({
        balance: z.number().int().nonnegative(),
        owner: z.object({
          id: z.string().nanoid(),
          fullName: z.string(),
        }),
      }),
    }),
    404: z.object({
      status: z.string().default('fail'),
      data: z.object({
        message: z.string(),
      }),
      code: z.number().default(404),
    }),
  },
};
export const getAccountTransactionsSchema = {
  summary: 'Fetches the transaction history for the specified account.',
  tags: ['accounts', 'transactions'],
  params: accountParamsSchema,
  response: {
    200: z.object({
      status: z.string().default('success'),
      data: z.array(transactionSchema),
    }),
    404: z.object({
      status: z.string().default('fail'),
      data: z.object({
        message: z.string(),
      }),
      code: z.number().default(404),
    }),
  },
};

export type getAccountParamsDataType = z.infer<typeof getAccountSchema.params>;
