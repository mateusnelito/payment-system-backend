import { AccountType } from '../constants/account.type';
import { prisma } from '../lib/prisma.lib';
import { createUserAccountDataType } from '../schemas/user.schema';
import ClientError from '../utils/client-error.util';
import HttpStatusCodes from '../utils/http-status-codes.util';
import { generateNanoId } from '../utils/nanoid.util';

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

export async function createAccount(
  userId: string,
  data: createUserAccountDataType
) {
  const { type: accountType, initialBalance } = data;
  const accountId = await generateNanoId();

  const account = await prisma.account.create({
    data: {
      id: accountId,
      userId,
      accountTypeId: AccountType[accountType],
      balance: initialBalance,
    },
    include: {
      AccountType: {
        select: {
          name: true,
        },
      },
    },
  });

  return {
    id: account.id,
    type: account.AccountType.name,
    balance: account.balance,
    createdAt: account.createdAt,
  };
}
