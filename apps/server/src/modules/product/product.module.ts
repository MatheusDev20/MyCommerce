import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateProductController } from './commands/create/controller';

@Module({
  imports: [CqrsModule],
  controllers: [CreateProductController],
})
export class ProductModule {}
