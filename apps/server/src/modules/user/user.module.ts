import { forwardRef, Module } from '@nestjs/common';
import { CreateUserController } from './commands/create/controller';
import { CreateUserService } from './commands/create/handler';
import { DeleteUserController } from './commands/delete/controller';
import { DeleteUserHandler } from './commands/delete/handler';
import { EditUserController } from './commands/edit/controller';
import { EditUserHandler } from './commands/edit/handler';
import { CqrsModule } from '@nestjs/cqrs';
import { AddressRepository } from './db/address/address.repository';
import { PrismaUserRepository } from './db/user/user-repository';
import { UserProfileController } from './query/profile/controller';
import { AuthModule } from '../auth/auth.module';
import { UserMapper } from './user.mapper';
import { GetCurrentUserController } from './query/me/controller';
import { QueryUserProfileHandler } from './query/profile/handler';

@Module({
  imports: [CqrsModule, forwardRef(() => AuthModule)],
  controllers: [
    CreateUserController,
    EditUserController,
    DeleteUserController,
    UserProfileController,
    GetCurrentUserController,
  ],
  providers: [
    CreateUserService,
    EditUserHandler,
    DeleteUserHandler,
    QueryUserProfileHandler,
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
