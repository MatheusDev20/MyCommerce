import { Body, Controller, Post, Res } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { routesV1 } from 'src/configs/app.routes';
import { LoginDTO, loginSchema } from '../../schemas/login.schema';
import { ZodPipe } from 'src/pipes/zod';
import { LoginCommand } from './command';
import { Response } from 'express';

@Controller()
export class LoginController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post(routesV1.version + '/' + routesV1.auth.root + '/login')
  async login(
    @Res() response: Response,
    @Body(new ZodPipe(loginSchema)) body: LoginDTO,
  ): Promise<any> {
    const command = new LoginCommand({ ...body });

    return this.commandBus.execute(command);
  }
}
