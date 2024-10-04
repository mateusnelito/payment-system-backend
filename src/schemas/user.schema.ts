import { z } from 'zod';
import {
  BIRegex,
  fullNameRegex,
  strongPasswordRegex,
} from '../utils/regex.util';
import { accountSchema } from './account.schema';

const userSchema = z.object({
  id: z.string().trim(),
  fullName: z
    .string()
    .trim()
    .min(2)
    .max(100)
    .regex(fullNameRegex, 'invalid full name'),
  bi: z.string().trim().regex(BIRegex, 'Invalid BI number'),
  email: z.string().trim().email(),
  password: z
    .string()
    .trim()
    .regex(
      strongPasswordRegex,
      'password must be strong and between 6 and 255 characters long'
    ),
  account: accountSchema.omit({
    id: true,
    userId: true,
    createdAt: true,
  }),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createUserSchema = userSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const getUserParamsSchema = z.object({
  userId: z.string().trim(),
});

export const createUserAccountSchema = accountSchema.omit({
  id: true,
  userId: true,
  createdAt: true,
});

export type createUserDataType = z.infer<typeof createUserSchema>;
export type createUserAccountDataType = z.infer<typeof createUserAccountSchema>;
