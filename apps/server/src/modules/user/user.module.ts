import { Module } from '@nestjs/common';
import { CreateUserController } from './commands/create-user/controller';
import { CreateUserService } from './commands/create-user/handler';
import { CqrsModule } from '@nestjs/cqrs';
import { AddressRepository } from './db/address/address.repository';
import { PrismaUserRepository } from './db/user/user-repository';

@Module({
  imports: [CqrsModule],
  controllers: [CreateUserController],
  providers: [CreateUserService, PrismaUserRepository, AddressRepository],
})
export class UserModule {}
