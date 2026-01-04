import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { routesV1 } from 'src/configs/app.routes';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';
import { ZodPipe } from 'src/pipes/zod';
import {
  AddProductDTO,
  addProductSchema,
} from '../../schemas/add-product.schema';
import { AddProductCommand } from './command';
import { HttpResponse, ok } from 'src/shared/http/common-responses';

@Controller(routesV1.version)
@UseGuards(AuthGuard)
export class AddProductController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post(routesV1.product.root)
  @Roles('ADMIN')
  async add(
    @Body(new ZodPipe(addProductSchema)) body: AddProductDTO,
  ): Promise<HttpResponse<{ id: string }>> {
    const command = new AddProductCommand({ ...body });

    const { id } = await this.commandBus.execute<
      AddProductCommand,
      { id: string }
    >(command);

    return ok({ id });
  }
}
