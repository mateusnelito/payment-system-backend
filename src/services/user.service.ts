import { prisma } from '../lib/prisma.lib';
import { createUserDataType } from '../schemas/user.schema';
import { hashPassword } from '../utils/bcrypt.util';
import ClientError from '../utils/client-error.util';
import HttpStatusCodes from '../utils/http-status-codes.util';
import { generateNanoId } from '../utils/nanoid.util';

export async function checkUserExistence(email: string, bi: string) {
  const user = await prisma.user.findFirst({
    where: { OR: [{ email }, { bi }] },
    select: { email: true, bi: true },
  });

  if (user?.email === email)
    throw new ClientError('invalid email', HttpStatusCodes.CONFLICT, {
      email: ['already in use'],
    });

  if (user?.bi === bi)
    throw new ClientError('invalid bi', HttpStatusCodes.CONFLICT, {
      bi: ['already in use'],
    });
}

export async function createUser(data: createUserDataType) {
  const {
    fullName,
    bi,
    email,
    password,
    account: { accountTypeId, initialBalance },
  } = data;

  const [userId, passwordHash, accountId] = await Promise.all([
    generateNanoId(),
    hashPassword(password),
    generateNanoId(),
  ]);

  const user = await prisma.user.create({
    data: {
      id: userId,
      fullName,
      bi,
      email,
      passwordHash,
      Account: {
        create: {
          id: accountId,
          accountTypeId,
          balance: initialBalance,
        },
      },
    },
    include: {
      Account: {
        select: {
          id: true,
          balance: true,
          createdAt: true,
          AccountType: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  return {
    id: user.id,
    fullName: user.fullName,
    bi: user.bi,
    email: user.email,
    account: {
      id: user.Account[0].id,
      balance: user.Account[0].balance,
      accountType: {
        id: user.Account[0].AccountType.id,
        name: user.Account[0].AccountType.name,
      },
    },
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export async function getUser(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      fullName: true,
      bi: true,
      email: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          Account: {},
        },
      },
    },
  });

  if (!user) {
    throw new ClientError("user don't exist", HttpStatusCodes.NOT_FOUND);
  }

  return {
    id: user.id,
    fullName: user.fullName,
    bi: user.bi,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    accounts: user._count.Account,
  };
}
