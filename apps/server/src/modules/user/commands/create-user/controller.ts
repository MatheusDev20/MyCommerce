import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserCommand } from './command';
import { routesV1 } from 'src/configs/app.routes';
import { CommandBus } from '@nestjs/cqrs';
import { ZodPipe } from 'src/pipes/zod';
import { CreateUserDTO, createUserSchema } from '../../schemas/create-user';
import { HttpResponse, ok } from 'src/shared/http/common-responses';

@Controller(routesV1.version)
export class CreateUserController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post(routesV1.user.root)
  async create(
    @Body(new ZodPipe(createUserSchema)) body: CreateUserDTO,
  ): Promise<HttpResponse<{ id: string }>> {
    /* CQS - Command Query Separation */

    const command = new CreateUserCommand({ ...body });

    const { id } = await this.commandBus.execute<
      CreateUserCommand,
      { id: string }
    >(command);

    return ok({ id });
  }
}
