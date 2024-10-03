import z from 'zod';

export const accountSchema = z.object({
  id: z.string().trim(),
  userId: z.string().trim(),
  accountTypeId: z.number().int().positive(),
  initialBalance: z.number().optional(),
  createdAt: z.date(),
});
