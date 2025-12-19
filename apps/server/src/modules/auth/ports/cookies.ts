import { Response } from 'express';

export type CookiesPort = {
  setAccessToken(response: Response, token: string): void;
  setRefreshToken(response: Response, token: string): void;
  clearAuthCookies(response: Response): void;
};
