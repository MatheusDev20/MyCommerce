import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AddProductController } from './commands/add/controller';
import { AddProductHandler } from './commands/add/handler';
import { EditProductController } from './commands/edit/controller';
import { EditProductHandler } from './commands/edit/handler';
import { DeleteProductController } from './commands/delete/controller';
import { DeleteProductHandler } from './commands/delete/handler';
import { GetProductController } from './query/get-one/controller';
import { GetProductHandler } from './query/get-one/handler';
import { GetAllProductsController } from './query/get-all/controller';
import { GetAllProductsHandler } from './query/get-all/handler';
import { ProductMapper } from './product.mapper';
import { PrismaProductRepository } from './db/product.repository';
import { SkuGeneratorService } from './services/sku-generator.service';

@Module({
  imports: [CqrsModule],
  controllers: [
    AddProductController,
    EditProductController,
    DeleteProductController,
    GetProductController,
    GetAllProductsController,
  ],
  providers: [
    AddProductHandler,
    EditProductHandler,
    DeleteProductHandler,
    GetProductHandler,
    GetAllProductsHandler,
    ProductMapper,
    SkuGeneratorService,
    {
      provide: 'ProductRepository',
      useClass: PrismaProductRepository,
    },
  ],
})
export class ProductModule {}
