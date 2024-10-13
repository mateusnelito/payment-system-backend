import { z } from 'zod';

export const clientErrorSchema = z.record(
  z.string(),
  z.array(z.string()).or(z.record(z.string(), z.array(z.string())))
);

export type clientErrorType = z.infer<typeof clientErrorSchema>;
