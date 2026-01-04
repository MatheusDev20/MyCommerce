import { Controller, Get, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { routesV1 } from 'src/configs/app.routes';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';
import {
  AuthenticatedUser,
  CurrentUser,
} from 'src/modules/auth/decorators/current-user.decorator';
import { QueryUserProfileCommand } from './command';
import { UserProfileDTO } from '../../schemas/user-profile';
import { HttpResponse, ok } from 'src/shared/http/common-responses';

@Controller(routesV1.version)
@UseGuards(AuthGuard)
export class UserProfileController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get(`${routesV1.user.root}/profile`)
  async getProfile(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<HttpResponse<UserProfileDTO>> {
    const query = new QueryUserProfileCommand({ userId: user.id });

    const profile = await this.queryBus.execute<
      QueryUserProfileCommand,
      UserProfileDTO
    >(query);

    return ok(profile);
  }
}
