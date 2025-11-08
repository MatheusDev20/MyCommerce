import { Controller, Post } from '@nestjs/common';
import { routesV1 } from 'src/configs/app.routes';

@Controller(routesV1.version)
export class ProductController {
  @Post(routesV1.product.root)
  async create() {
    return { message: 'Create product endpoint' };
  }
}
