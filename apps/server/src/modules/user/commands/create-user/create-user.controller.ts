import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDTO } from './create-user.dto';
import { CreateUserCommand } from './create-user.command';
import { routesV1 } from 'src/configs/app.routes';
import { CommandBus } from '@nestjs/cqrs';

@Controller(routesV1.version)
export class CreateUserController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post(routesV1.user.root)
  async create(@Body() body: CreateUserDTO): Promise<any> {
    /* CQS - Command Query Separation */

    const command = new CreateUserCommand(body);
    await this.commandBus.execute(command);

    return { message: 'User created successfully' };
  }
}
