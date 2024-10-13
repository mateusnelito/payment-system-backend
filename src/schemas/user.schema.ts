import { z } from 'zod';
import {
  BIRegex,
  fullNameRegex,
  strongPasswordRegex,
} from '../utils/regex.util';
import { accountSchema } from './account.schema';
import { clientErrorSchema } from './error.schema';

const userSchema = z.object({
  id: z.string().trim().nanoid(),
  fullName: z
    .string()
    .trim()
    .min(2)
    .max(100)
    .regex(fullNameRegex, 'invalid'),
  bi: z.string().trim().regex(BIRegex, 'Invalid'),
  email: z.string().trim().email(),
  password: z
    .string()
    .trim()
    .regex(
      strongPasswordRegex,
      'password must be strong and between 6 and 255 characters long'
    ),
  account: accountSchema.pick({type: true, initialBalance: true}),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createUserSchema = {
  summary: 'Creates a new user with the provided details.',
  tags: ['users'],
  body: userSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  }),
  response: {
    201: z.object({
      status: z.string().default('success'),
      data: userSchema.omit({ password: true }).extend({
        account: accountSchema.pick({id: true, type: true})
          .extend({ balance: z.number().int() }),
      }),
    }),
    400: z.object({
      status: z.string().default('fail'),
      data: z.object({
        message: z.string(),
        errors: clientErrorSchema,
      }),
      code: z.number().default(400),
    }),
  },
};

export const getUserParamsSchema = z.object({
  userId: z.string().trim(),
});

export const createUserAccountSchema = accountSchema.omit({
  id: true,
  userId: true,
  createdAt: true,
});

export type createUserDataType = z.infer<typeof createUserSchema.body>;
export type createUserAccountDataType = z.infer<typeof createUserAccountSchema>;
