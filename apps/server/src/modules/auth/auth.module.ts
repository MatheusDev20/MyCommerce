import { forwardRef, Module } from '@nestjs/common';
import { LoginController } from './commands/login/controller';
import { CqrsModule } from '@nestjs/cqrs';
import { BcryptPasswordHasher } from './infra/hashers/bcrypt';
import { LoginHandler } from './commands/login/handler';
import { UserModule } from '../user/user.module';

@Module({
  controllers: [LoginController],
  imports: [CqrsModule, forwardRef(() => UserModule)],
  providers: [
    LoginHandler,
    {
      provide: 'Hashing',
      useClass: BcryptPasswordHasher,
    },
  ],
  exports: [
    {
      provide: 'Hashing',
      useClass: BcryptPasswordHasher,
    },
  ],
})
export class AuthModule {}
