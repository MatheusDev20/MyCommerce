import {
  Body,
  Controller,
  ForbiddenException,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { EditUserCommand } from './command';
import { routesV1 } from 'src/configs/app.routes';
import { CommandBus } from '@nestjs/cqrs';
import { ZodPipe } from 'src/pipes/zod';
import { EditUserDTO, editUserSchema } from '../../schemas/edit-user';
import { HttpResponse, ok } from 'src/shared/http/common-responses';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';
import {
  AuthenticatedUser,
  CurrentUser,
} from 'src/modules/auth/decorators/current-user.decorator';

@Controller(routesV1.version)
@UseGuards(AuthGuard)
export class EditUserController {
  constructor(private readonly commandBus: CommandBus) {}

  @Patch(routesV1.user.edit)
  async edit(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') userId: string,
    @Body(new ZodPipe(editUserSchema)) body: EditUserDTO,
  ): Promise<HttpResponse<{ id: string }>> {
    // Authorization: Users can only edit their own profile, unless they're an admin
    if (user.role !== 'ADMIN' && user.id !== userId) {
      throw new ForbiddenException(
        'You do not have permission to edit this user',
      );
    }

    const command = new EditUserCommand({ userId, ...body });

    const result = await this.commandBus.execute<
      EditUserCommand,
      { id: string }
    >(command);

    return ok(result);
  }
}
