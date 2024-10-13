import z from 'zod';
import { clientErrorSchema } from './error.schema';

export const transactionSchema = z.object({
  id: z.number().int().positive(),
  fromAccountId: z.string().trim().nanoid(),
  toAccountId: z.string().trim().nanoid(),
  amount: z.number().int().nonnegative(),
  createdAt: z.date(),
});

const transactionParamsSchema = z.object({
  transactionId: z.coerce.number().int().positive(),
});

export const createTransactionSchema = {
  summary:
    'Creates a new transaction between two accounts, specifying the amount and account details.',
  tags: ['transactions'],
  body: transactionSchema.omit({
    id: true,
    createdAt: true,
  }),
  response: {
    201: z.object({
      status: z.string().default('success'),
      data: transactionSchema,
    }),
    400: z.object({
      status: z.string().default('fail'),
      data: z.object({
        message: z.string(),
        errors: clientErrorSchema.optional(),
      }),
      code: z.number().default(400),
    }),
    403: z.object({
      status: z.string().default('fail'),
      data: z.object({
        message: z.string(),
      }),
      code: z.number().default(403),
    }),
  },
};

export const getTransactionSchema = {
  summary: 'Retrieves the details of a specific transaction by its unique ID.',
  tags: ['transactions'],
  params: transactionParamsSchema,
  response: {
    200: z.object({
      status: z.string().default('success'),
      data: transactionSchema,
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

export type transactionParamsDataType = z.infer<
  typeof getTransactionSchema.params
>;

export type createTransactionDataType = z.infer<
  typeof createTransactionSchema.body
>;
