import { Controller, Get } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { routesV1 } from 'src/configs/app.routes';
import { GetAllProductsQuery } from './command';
import { ProductDTO } from '../../schemas/product.dto';
import { HttpResponse, ok } from 'src/shared/http/common-responses';

@Controller(routesV1.version)
export class GetAllProductsController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get(routesV1.product.getAll)
  async getAll(): Promise<HttpResponse<ProductDTO[]>> {
    const query = new GetAllProductsQuery({});

    const products = await this.queryBus.execute<
      GetAllProductsQuery,
      ProductDTO[]
    >(query);

    return ok(products);
  }
}
