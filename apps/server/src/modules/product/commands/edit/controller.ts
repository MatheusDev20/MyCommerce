import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { routesV1 } from 'src/configs/app.routes';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';
import { ZodPipe } from 'src/pipes/zod';
import {
  EditProductDTO,
  editProductSchema,
} from '../../schemas/edit-product.schema';
import { EditProductCommand } from './command';
import { HttpResponse, ok } from 'src/shared/http/common-responses';

@Controller(routesV1.version)
@UseGuards(AuthGuard)
@Roles('ADMIN')
export class EditProductController {
  constructor(private readonly commandBus: CommandBus) {}

  @Patch(routesV1.product.edit)
  async edit(
    @Param('id') productId: string,
    @Body(new ZodPipe(editProductSchema)) body: EditProductDTO,
  ): Promise<HttpResponse<{ id: string }>> {
    const command = new EditProductCommand({ productId, ...body });

    const result = await this.commandBus.execute<
      EditProductCommand,
      { id: string }
    >(command);

    return ok(result);
  }
}
