import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AddProductController } from './commands/add/controller';
import { AddProductHandler } from './commands/add/handler';
import { ProductMapper } from './product.mapper';
import { PrismaProductRepository } from './db/product.repository';

@Module({
  imports: [CqrsModule],
  controllers: [AddProductController],
  providers: [
    AddProductHandler,
    ProductMapper,
    {
      provide: 'ProductRepository',
      useClass: PrismaProductRepository,
    },
  ],
})
export class ProductModule {}
