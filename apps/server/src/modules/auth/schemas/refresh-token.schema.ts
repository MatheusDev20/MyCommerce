import z from 'zod';

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(10),
});

export type RefreshTokenDTO = z.infer<typeof refreshTokenSchema>;
