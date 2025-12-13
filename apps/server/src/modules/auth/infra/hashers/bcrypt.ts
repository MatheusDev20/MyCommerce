import * as bcrypt from 'bcrypt';
import { Hashing } from '../../ports/hashing.port';

export class BcryptPasswordHasher implements Hashing {
  private readonly saltRounds = 12;

  async hash(plain: string): Promise<string> {
    return bcrypt.hash(plain, this.saltRounds);
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  }
}
