import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService, TokenExpiredError, JsonWebTokenError } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    // Extract token from cookies
    const token = request.cookies?.access_token;
    if (!token) {
      throw new UnauthorizedException('Access token not found');
    }
    try {
      // Verify and decode token
      const payload = await this.jwtService.verifyAsync(token);

      request['user'] = {
        id: payload.sub,
        name: payload.name,
        role: payload.role,
      };

      const requiredRoles = this.reflector.get<string[]>(
        'roles',
        context.getHandler(),
      );

      if (requiredRoles && requiredRoles.length > 0) {
        const hasRole = requiredRoles.includes(payload.role);
        if (!hasRole) {
          throw new ForbiddenException('Insufficient permissions');
        }
      }

      return true;
    } catch (error) {
      // Re-throw ForbiddenException as-is
      if (error instanceof ForbiddenException) throw error;
      // Handle specific JWT errors
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('Access token has expired');
      }

      if (error instanceof JsonWebTokenError) {
        throw new UnauthorizedException('Invalid access token');
      }

      throw new UnauthorizedException('Authentication failed');
    }
  }
}
