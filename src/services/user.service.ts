import { prisma } from '../lib/prisma.lib';
import ClientError from '../utils/client-error.util';

export async function checkUserExistence(email: string, BI: string) {
  const user = await prisma.user.findFirst({
    where: { OR: [{ email }, { BI }] },
    select: { email: true, BI: true },
  });

  if (user) {
    if (user.email)
      throw new ClientError('invalid email', {
        email: ['email already in use'],
      });

    if (user.BI)
      throw new ClientError('invalid BI', {
        BI: ['BI already in use'],
      });
  }
}
