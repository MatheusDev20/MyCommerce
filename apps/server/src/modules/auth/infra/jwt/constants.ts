export const JWT_CONSTANTS = {
  secret: 'your_jwt_secret_key',
  signOptions: { expiresIn: '15m' } as any,
};

export const REFRESH_TOKEN_CONSTANTS = {
  expirationTime: 7 * 24 * 60 * 60 * 1000,
};
