import { Controller, Post } from '@nestjs/common';
import { routesV1 } from 'src/configs/app.routes';

@Controller(routesV1.version)
export class CreateProductController {
  constructor() {}

  @Post(routesV1.product.root)
  async create() {}
}
