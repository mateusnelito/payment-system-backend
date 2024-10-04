import z from 'zod';

export const accountSchema = z.object({
  id: z.string().trim(),
  userId: z.string().trim(),
  type: z.enum(['SHOPKEEPER', 'COMMON'], {
    message: 'must be SHOPKEEPER or COMMON',
  }),
  initialBalance: z.number().optional(),
  createdAt: z.date(),
});
