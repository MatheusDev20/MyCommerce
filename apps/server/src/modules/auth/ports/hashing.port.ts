export type Hashing = {
  hash(plain: string, type: 'password' | 'refreshToken'): Promise<string>;
  compare(plain: string, hashed: string): Promise<boolean>;
};
