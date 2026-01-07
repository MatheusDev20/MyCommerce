import {
  Controller,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { routesV1 } from 'src/configs/app.routes';
import { Request, Response } from 'express';
import { HttpResponse, ok } from 'src/shared/http/common-responses';
import { CommandBus } from '@nestjs/cqrs';
import { RefreshTokenCommand } from './command';

@Controller(routesV1.version)
export class RefreshTokenController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post(routesV1.auth.refreshToken)
  async refreshToken(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<HttpResponse<object>> {
    const refreshToken = request.cookies?.refresh_token;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    const command = new RefreshTokenCommand({
      refreshToken,
      res: response,
    });

    await this.commandBus.execute(command);

    return ok({});
  }
}
