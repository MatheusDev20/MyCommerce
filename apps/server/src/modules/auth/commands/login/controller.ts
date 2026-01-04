import { Body, Controller, Post, Res } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { routesV1 } from 'src/configs/app.routes';
import { LoginDTO, loginSchema } from '../../schemas/login.schema';
import { ZodPipe } from 'src/pipes/zod';
import { LoginCommand } from './command';
import { Response } from 'express';
import { HttpResponse, ok } from 'src/shared/http/common-responses';

@Controller(routesV1.version)
export class LoginController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post(routesV1.auth.root + '/login')
  async login(
    @Res({ passthrough: true }) response: Response,
    @Body(new ZodPipe(loginSchema)) body: LoginDTO,
  ): Promise<HttpResponse<object>> {
    const command = new LoginCommand({ ...body, res: response });

    await this.commandBus.execute(command);

    return ok({});
  }
}
