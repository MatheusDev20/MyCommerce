import { forwardRef, Module } from '@nestjs/common';
import { CreateUserController } from './commands/create-user/controller';
import { CreateUserService } from './commands/create-user/handler';
import { CqrsModule } from '@nestjs/cqrs';
import { AddressRepository } from './db/address/address.repository';
import { PrismaUserRepository } from './db/user/user-repository';
import { UserProfileController } from './query/profile/controller';
import { AuthModule } from '../auth/auth.module';
import { UserMapper } from './user.mapper';

@Module({
  imports: [CqrsModule, forwardRef(() => AuthModule)],
  controllers: [CreateUserController, UserProfileController],
  providers: [
    CreateUserService,
    {
      provide: 'UserRepository',
      useClass: PrismaUserRepository,
    },
    AddressRepository,
    UserMapper,
  ],
  exports: [
    {
      provide: 'UserRepository',
      useClass: PrismaUserRepository,
    },
  ],
})
export class UserModule {}
