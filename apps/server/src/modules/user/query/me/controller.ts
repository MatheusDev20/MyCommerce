import { Controller, Get, UseGuards } from '@nestjs/common';
import { routesV1 } from 'src/configs/app.routes';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';
import {
  AuthenticatedUser,
  CurrentUser,
} from 'src/modules/auth/decorators/current-user.decorator';
import { HttpResponse, ok } from 'src/shared/http/common-responses';

@Controller(routesV1.version)
@UseGuards(AuthGuard)
export class GetCurrentUserController {
  constructor() {}

  @Get(routesV1.user.me)
  async getCurrentUser(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<HttpResponse<AuthenticatedUser>> {
    return ok(user);
  }
}
