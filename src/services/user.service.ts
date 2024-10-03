import { prisma } from '../lib/prisma.lib';
import ClientError from '../utils/client-error.util';

export async function checkUserExistence(email: string, BI: string) {
  const user = await prisma.user.findFirst({
    where: { OR: [{ email }, { BI }] },
    select: { email: true, BI: true },
  });

  if (user) {
    if (user.email === email)
      throw new ClientError('invalid email', {
        email: ['already in use'],
      });

    if (user.BI === BI)
      throw new ClientError('invalid BI', {
        BI: ['already in use'],
      });
  }
}

export async function checkUserTypeExistence(id: number) {
  const userType = await prisma.userType.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!userType)
    throw new ClientError('invalid userTypeId', {
      userTypeId: ["don't exists"],
    });
}
