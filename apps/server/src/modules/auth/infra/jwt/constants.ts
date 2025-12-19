export const JWT_CONSTANTS = {
  secret: 'your_jwt_secret_key',
  signOptions: { expiresIn: 60000 }, // 60 seconds
};

export const REFRESH_TOKEN_CONSTANTS = {
  expirationTime: 7 * 24 * 60 * 60 * 1000,
};
