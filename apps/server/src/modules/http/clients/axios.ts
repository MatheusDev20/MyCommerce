import { Inject, Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { HttpClient, RequestDetails } from 'src/@types';
import { AUTH_PROVIDER, AXIOS_OPTIONS } from '../injection-tokens';

export type InstanceParams = {
  baseUrl: string;
  requireAuth: boolean;
  authClass: any;
};

@Injectable()
export class AxiosClient implements HttpClient {
  private instance: AxiosInstance;
  private requireAuth: boolean;

  constructor(
    @Inject(AXIOS_OPTIONS) private options: InstanceParams,
    @Inject(AUTH_PROVIDER) private authProvider,
  ) {
    this.instance = axios.create({
      baseURL: options.baseUrl,
    });
    this.requireAuth = options.requireAuth;
  }

  private convertQueryParams(path: string, params: object): string {
    return (
      `${path}?` +
      Object.entries(params)
        .map(([key, value]) => `${key}=${value}`)
        .join('&')
    );
  }

  async GET(details: RequestDetails) {
    const options = { ...details };
    if (options.queryParams)
      options.path = this.convertQueryParams(details.path, details.queryParams);

    if (this.requireAuth) {
      const authHeaders = await this.authProvider.getAuthHeaders();

      options.headers = authHeaders;
    }

    const httpResponse = await this.instance.get(options.path, {
      headers: options.headers,
    });

    return httpResponse.data;
  }
}
