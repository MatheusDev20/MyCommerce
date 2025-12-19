import { Injectable, Scope } from '@nestjs/common';
import { Response } from 'express';
import { CookiesPort } from '../../ports/cookies';
import { REFRESH_TOKEN_CONSTANTS } from '../jwt/constants';

@Injectable({ scope: Scope.REQUEST })
export class CookieService implements CookiesPort {
  constructor() {}

  setAccessToken(response: Response, token: string) {
    response.cookie('access_token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000,
      path: '/',
    });
  }

  setRefreshToken(response: Response, token: string) {
    response.cookie('refresh_token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: REFRESH_TOKEN_CONSTANTS.expirationTime,
      path: '/',
    });
  }

  clearAuthCookies(response: Response) {
    response.clearCookie('access_token', { path: '/' });
    response.clearCookie('refresh_token', { path: '/auth/refresh' });
  }
}
