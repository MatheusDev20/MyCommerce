/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  NestInterceptor,
  ExecutionContext,
  Injectable,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { asyncLocalStorage } from './async-local-storage';

@Injectable()
export class RequestInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    const id = request.headers['x-request-id'] || uuidv4();
    request.requestId = id;

    return asyncLocalStorage.run({ requestId: id }, () => next.handle());
  }
}
