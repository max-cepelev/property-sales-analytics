import * as argon2 from 'argon2';
import { randomBytes } from 'node:crypto';

const hashingConfig = {
  // based on OWASP cheat sheet recommendations (as of March, 2022)
  parallelism: 1,
  memoryCost: 64000, // 64 mb
  timeCost: 3, // number of iterations
};

export async function hashPassword(password: string) {
  const salt = randomBytes(16);
  return await argon2.hash(password, {
    ...hashingConfig,
    salt,
  });
}

export async function verifyPasswordWithHash(
  candidatePassword: string,
  hash: string,
) {
  return await argon2.verify(hash, candidatePassword, hashingConfig);
}
