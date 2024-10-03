import bcrypt from 'bcrypt';

export async function hashPassword(password: string) {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  return await bcrypt.hash(password, salt);
}

export async function comparePassword(
  password: string,
  passwordHash: string
): Promise<Boolean> {
  return await bcrypt.compare(password, passwordHash);
}
