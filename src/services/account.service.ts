import { AccountType } from '../constants/account.type';
import { prisma } from '../lib/prisma.lib';
import ClientError from '../utils/client-error.util';
import HttpStatusCodes from '../utils/http-status-codes.util';

export async function checkUserAccountTypeExistence(
  userId: string,
  accountType: keyof typeof AccountType
) {
  const account = await prisma.account.findUnique({
    where: {
      userId_accountTypeId: { userId, accountTypeId: AccountType[accountType] },
    },
    select: { id: true },
  });

  if (account)
    throw new ClientError('invalid account type', HttpStatusCodes.CONFLICT, {
      type: ['The user already has an account of this type'],
    });
}
