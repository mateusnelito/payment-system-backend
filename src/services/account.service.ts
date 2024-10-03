import { prisma } from '../lib/prisma.lib';
import ClientError from '../utils/client-error.util';

export async function checkAccountTypeExistence(id: number) {
  const accountType = await prisma.accountType.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!accountType)
    throw new ClientError('invalid accountTypeId', {
      account: {
        accountTypeId: ["don't exists"],
      },
    });
}
