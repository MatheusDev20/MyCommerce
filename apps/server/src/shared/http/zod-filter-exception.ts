import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';
import { ZodError } from 'zod';

@Catch(ZodError)
export class ZodExceptionFilter implements ExceptionFilter {
  catch(exception: ZodError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const errors = exception.errors.map((err) => {
      const field = err.path.join('.');
      return {
        field: field || 'root',
        message: err.message,
        expected: this.getExpectedType(err),
        received: err.code === 'invalid_type' ? err.received : undefined,
      };
    });

    response.status(400).json({
      statusCode: 400,
      message: 'Validation failed',
      errors: errors,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

  private getExpectedType(err: any): string {
    try {
      if (err.code === 'invalid_type') {
        return err.expected ?? 'valid type';
      }
      if (err.code === 'too_small') {
        const minimum = err.minimum ?? 'unknown';
        if (err.type === 'string') {
          return `string with minimum length of ${minimum}`;
        }
        if (err.type === 'array') {
          return `array with minimum length of ${minimum}`;
        }
        if (err.type === 'number') {
          return `number >= ${minimum}`;
        }
        return err.type
          ? `${err.type} with minimum of ${minimum}`
          : `value with minimum of ${minimum}`;
      }
      if (err.code === 'too_big') {
        const maximum = err.maximum ?? 'unknown';
        if (err.type === 'string') {
          return `string with maximum length of ${maximum}`;
        }
        if (err.type === 'array') {
          return `array with maximum length of ${maximum}`;
        }
        if (err.type === 'number') {
          return `number <= ${maximum}`;
        }
        return err.type
          ? `${err.type} with maximum of ${maximum}`
          : `value with maximum of ${maximum}`;
      }
      if (err.code === 'invalid_string') {
        const validation = err.validation ?? 'valid';
        return `string matching ${validation} format`;
      }
      if (err.code === 'invalid_enum_value') {
        if (Array.isArray(err.options) && err.options.length > 0) {
          return `one of: ${err.options.join(', ')}`;
        }
        return 'valid enum value';
      }
      return 'valid value';
    } catch (error) {
      return 'valid value';
    }
  }
}
