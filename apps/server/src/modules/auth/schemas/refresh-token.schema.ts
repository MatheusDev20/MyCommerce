import z from 'zod';

// Empty schema since refresh token comes from cookies, not request body
export const refreshTokenSchema = z.object({});

export type RefreshTokenDTO = z.infer<typeof refreshTokenSchema>;
