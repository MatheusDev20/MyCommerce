import * as bcrypt from 'bcrypt';
import { Hashing } from '../../ports/hashing.port';

export class BcryptPasswordHasher implements Hashing {
  private readonly passwordSalt = 12;
  private readonly refreshTokenSalt = 16;

  async hash(
    plain: string,
    type: 'password' | 'refreshToken',
  ): Promise<string> {
    const salt =
      type === 'password' ? this.passwordSalt : this.refreshTokenSalt;

    return bcrypt.hash(plain, salt);
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  }
}
