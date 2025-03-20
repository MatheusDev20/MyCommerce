import { HTTP_CLIENT } from './injection-tokens';
import { Inject, Injectable } from '@nestjs/common';
import { HttpClient, RequestDetails } from 'src/@types';

@Injectable()
export class FireExternalRequest {
  constructor(@Inject(HTTP_CLIENT) private httpClient: HttpClient) {}

  async fire(details: RequestDetails) {
    const response = await this.httpClient.GET(details);
    return response;
  }
}
