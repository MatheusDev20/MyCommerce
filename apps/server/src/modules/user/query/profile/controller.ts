import { Controller, Get } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { routesV1 } from 'src/configs/app.routes';

@Controller(routesV1.version)
export class UserProfileController {
  constructor(private readonly commandBus: CommandBus) {}

  @Get(`${routesV1.user.root}/profile`)
  async getProfile() {
    return { message: 'User profile endpoint' };
  }
}
