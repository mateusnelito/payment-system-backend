import { z } from 'zod';
import {
  BIRegex,
  fullNameRegex,
  strongPasswordRegex,
} from '../utils/regex.util';

const userSchema = z.object({
  id: z.string(),
  fullName: z
    .string()
    .trim()
    .min(2)
    .max(100)
    .regex(fullNameRegex, 'invalid full name'),
  BI: z.string().trim().regex(BIRegex, 'Invalid BI number'),
  email: z.string().trim().email(),
  password: z
    .string()
    .trim()
    .regex(
      strongPasswordRegex,
      'password must be strong and between 6 and 255 characters long'
    ),
  userTypeId: z.number().int().positive(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createUserSchema = userSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type createUserDataType = z.infer<typeof createUserSchema>;
