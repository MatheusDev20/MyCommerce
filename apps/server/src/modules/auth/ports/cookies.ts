export type CookiesPort = {
  setAccessToken(token: string): void;
  setRefreshToken(token: string): void;
  clearAuthCookies(): void;
};
