import { DynamicModule, Module } from '@nestjs/common';
import { FireExternalRequest } from './fire-request';
import { AxiosClient, InstanceParams } from './clients/axios';
import { AUTH_PROVIDER, AXIOS_OPTIONS, HTTP_CLIENT } from './injection-tokens';
import { CacheModule } from '@nestjs/cache-manager';
import { LoggerModule } from '../logger/logger.module';

@Module({})
export class HttpModule {
  static register(options: InstanceParams): DynamicModule {
    return {
      imports: [CacheModule.register(), LoggerModule],
      module: HttpModule,
      providers: [
        FireExternalRequest,
        { provide: HTTP_CLIENT, useClass: AxiosClient },
        { provide: AXIOS_OPTIONS, useValue: options },
        { provide: AUTH_PROVIDER, useClass: options.authClass },
      ],
      exports: [FireExternalRequest],
    };
  }
}
