import { Controller, Delete, Param, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { routesV1 } from 'src/configs/app.routes';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';
import { DeleteProductCommand } from './command';
import { HttpResponse, deleted } from 'src/shared/http/common-responses';

@Controller(routesV1.version)
@UseGuards(AuthGuard)
@Roles('ADMIN')
export class DeleteProductController {
  constructor(private readonly commandBus: CommandBus) {}

  @Delete(routesV1.product.delete)
  async delete(
    @Param('id') productId: string,
  ): Promise<HttpResponse<{ id: string }>> {
    const command = new DeleteProductCommand({ productId });

    const result = await this.commandBus.execute<
      DeleteProductCommand,
      { id: string }
    >(command);

    return deleted(result);
  }
}
