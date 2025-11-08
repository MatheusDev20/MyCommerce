import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ProductController } from './controller';

@Module({
  imports: [CqrsModule],
  controllers: [ProductController],
  // providers: [CreateUserService, PrismaUserRepository, AddressRepository],
})
export class ProductModule {}
