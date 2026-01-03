import { Body, Controller, Get } from '@nestjs/common';
import { routesV1 } from 'src/configs/app.routes';
import {
  RefreshTokenDTO,
  refreshTokenSchema,
} from '../../schemas/refresh-token.schema';
import { ZodPipe } from 'src/pipes/zod';

@Controller()
export class RefreshTokenController {
  constructor() {}

  @Get(routesV1.version + routesV1.auth.refreshToken)
  async refreshToken(
    @Body(new ZodPipe(refreshTokenSchema)) data: RefreshTokenDTO,
  ) {
    return {};
  }
}
