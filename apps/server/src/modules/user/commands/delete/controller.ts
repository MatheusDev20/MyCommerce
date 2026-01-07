import { Controller, Delete, Param, UseGuards } from '@nestjs/common';
import { DeleteUserCommand } from './command';
import { routesV1 } from 'src/configs/app.routes';
import { CommandBus } from '@nestjs/cqrs';
import { HttpResponse, deleted } from 'src/shared/http/common-responses';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';

@Controller(routesV1.version)
@UseGuards(AuthGuard)
@Roles('ADMIN')
export class DeleteUserController {
  constructor(private readonly commandBus: CommandBus) {}

  @Delete(routesV1.user.delete)
  async delete(
    @Param('id') userId: string,
  ): Promise<HttpResponse<{ id: string }>> {
    const command = new DeleteUserCommand({ userId });

    const result = await this.commandBus.execute<
      DeleteUserCommand,
      { id: string }
    >(command);

    return deleted(result);
  }
}
