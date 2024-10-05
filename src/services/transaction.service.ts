import { AccountType } from '../constants/account.type';
import { prisma } from '../lib/prisma.lib';
import { createTransactionDataType } from '../schemas/transaction.schema';
import ClientError from '../utils/client-error.util';
import HttpStatusCodes from '../utils/http-status-codes.util';
import { accountExists } from './account.service';
import { authorizeTransaction } from './transaction-authorization.service';

export async function validateTransaction(data: createTransactionDataType) {
  const { fromAccountId, toAccountId, amount } = data;

  // Checks if the source and destination accounts are the same
  if (fromAccountId === toAccountId)
    throw new ClientError(
      'Source and destination accounts must be different.',
      HttpStatusCodes.BAD_REQUEST
    );

  // Fetching both accounts in parallel for efficiency
  const [fromAccount, toAccount] = await Promise.all([
    accountExists(fromAccountId),
    accountExists(toAccountId),
  ]);

  // Checks if the source account exists
  if (!fromAccount)
    throw new ClientError('Invalid from account', HttpStatusCodes.NOT_FOUND, {
      fromAccountId: ['Account not found.'],
    });

  // Checks if target account exists
  if (!toAccount)
    throw new ClientError('Invalid to account', HttpStatusCodes.NOT_FOUND, {
      toAccountId: ['Account not found.'],
    });

  // Checks if the source account is a Merchant type
  if (AccountType[fromAccount.accountTypeId] === 'MERCHANT')
    throw new ClientError(
      'Transaction not allowed',
      HttpStatusCodes.FORBIDDEN,
      {
        fromAccountId: ['Merchant accounts cannot send money.'],
      }
    );

  // Checks if the source account has sufficient balance to complete the transaction
  if (fromAccount.balance < amount)
    throw new ClientError(
      'Insufficient funds for transaction',
      HttpStatusCodes.FORBIDDEN,
      {
        fromAccountId: [
          'The source account does not have enough balance to complete this transaction.',
        ],
      }
    );

  // Checks if the transaction is authorized
  if (!(await authorizeTransaction()))
    throw new ClientError(
      'Transaction not authorized.',
      HttpStatusCodes.FORBIDDEN
    );

  return {
    fromAccount: {
      id: fromAccount.id,
      balance: fromAccount.balance,
    },
    toAccount: {
      id: toAccount.id,
      balance: toAccount.balance,
    },
    amount,
  };
}

interface createTransactionDataInterface {
  fromAccount: {
    id: string;
    balance: number;
  };
  toAccount: {
    id: string;
    balance: number;
  };
  amount: number;
}

export async function createTransaction(data: createTransactionDataInterface) {
  const { fromAccount, toAccount, amount } = data;

  return await prisma.$transaction(async (transaction) => {
    await transaction.account.update({
      where: { id: fromAccount.id },
      data: { balance: fromAccount.balance - amount },
    });

    await transaction.account.update({
      where: { id: toAccount.id },
      data: { balance: toAccount.balance + amount },
    });

    const newTransaction = await transaction.transaction.create({
      data: {
        fromAccountId: fromAccount.id,
        toAccountId: toAccount.id,
        amount,
      },
    });

    return {
      id: newTransaction.id,
      fromAccountId: fromAccount.id,
      toAccountId: toAccount.id,
      amount,
      createdAt: newTransaction.createdAt,
    };
  });
}
