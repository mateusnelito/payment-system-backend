import { prisma } from '../lib/prisma.lib';
import { createUserDataType } from '../schemas/user.schema';
import { hashPassword } from '../utils/bcrypt.util';
import ClientError from '../utils/client-error.util';
import { generateNanoId } from '../utils/nanoid.util';

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

export async function createUser(data: createUserDataType) {
  const { fullName, BI, email, password, userTypeId } = data;

  const user = await prisma.user.create({
    data: {
      id: await generateNanoId(),
      fullName,
      BI,
      email,
      passwordHash: await hashPassword(password),
      userTypeId,
    },
    include: {
      userType: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return {
    id: user.id,
    fullName: user.fullName,
    BI: user.BI,
    email: user.email,
    userType: {
      id: user.userType.id,
      name: user.userType.name,
    },
  };
}
