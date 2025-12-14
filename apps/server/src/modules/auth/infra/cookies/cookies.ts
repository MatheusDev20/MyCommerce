import { Inject, Injectable, Scope } from '@nestjs/common';
import { Response } from 'express';
import { CookiesPort } from '../../ports/cookies';
import { REQUEST } from '@nestjs/core';

@Injectable({ scope: Scope.REQUEST })
export class CookieService implements CookiesPort {
  private readonly response: Response;
 
  constructor(@Inject(REQUEST) request: any) {
    this.response = request.res;
  }

  setAccessToken(token: string) {
    this.response.cookie('access_token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000, // 15 minutes
      path: '/',
    });
  }

  setRefreshToken(token: string) {
    this.response.cookie('refresh_token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      path: '/auth/refresh',
    });
  }

  clearAuthCookies() {
    this.response.clearCookie('access_token', { path: '/' });
    this.response.clearCookie('refresh_token', { path: '/auth/refresh' });
  }
}
