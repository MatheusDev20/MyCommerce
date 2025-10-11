import { Module } from '@nestjs/common';
import { CreateUserController } from './commands/create-user/create-user.controller';
import { CreateUserService } from './commands/create-user/create-user-service';
import { CqrsModule } from '@nestjs/cqrs';
import { UserRepository } from './db/user/user-repository';
import { AddressRepository } from './db/address/address.repository';

@Module({
  imports: [CqrsModule],
  controllers: [CreateUserController],
  providers: [CreateUserService, UserRepository, AddressRepository],
})
export class UserModule {}
