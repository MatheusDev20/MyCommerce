import { Body, Controller, Get } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { routesV1 } from 'src/configs/app.routes';
import { LoginDTO, loginSchema } from '../../schemas/login.schema';
import { ZodPipe } from 'src/pipes/zod';
import { LoginCommand } from './command';

@Controller()
export class LoginController {
  constructor(private readonly commandBus: CommandBus) {}

  @Get(routesV1.version + '/' + routesV1.auth.root + '/login')
  async login(@Body(new ZodPipe(loginSchema)) body: LoginDTO): Promise<any> {
    const command = new LoginCommand({ ...body });

    return this.commandBus.execute(command);
  }
}
