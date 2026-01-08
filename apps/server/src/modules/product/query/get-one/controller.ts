import { Controller, Get, Param } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { routesV1 } from 'src/configs/app.routes';
import { GetProductQuery } from './command';
import { ProductDTO } from '../../schemas/product.dto';
import { HttpResponse, ok } from 'src/shared/http/common-responses';

@Controller(routesV1.version)
export class GetProductController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get(routesV1.product.getOne)
  async getOne(
    @Param('id') productId: string,
  ): Promise<HttpResponse<ProductDTO>> {
    const query = new GetProductQuery({ productId });

    const product = await this.queryBus.execute<GetProductQuery, ProductDTO>(
      query,
    );

    return ok(product);
  }
}
