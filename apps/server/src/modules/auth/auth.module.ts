import { forwardRef, Module } from '@nestjs/common';
import { LoginController } from './commands/login/controller';
import { CqrsModule } from '@nestjs/cqrs';
import { BcryptPasswordHasher } from './infra/hashers/bcrypt';
import { LoginHandler } from './commands/login/handler';
import { UserModule } from '../user/user.module';
import { JWTTools } from './infra/jwt/jwt';
import { JwtModule } from '@nestjs/jwt';
import { JWT_CONSTANTS } from './infra/jwt/constants';
import { CookieService } from './infra/cookies/cookies';

@Module({
  controllers: [LoginController],
  imports: [
    CqrsModule,
    JwtModule.register({
      global: true,
      secret: JWT_CONSTANTS.secret,
      signOptions: JWT_CONSTANTS.signOptions,
    }),
    forwardRef(() => UserModule),
  ],
  providers: [
    LoginHandler,
    CookieService,
    JWTTools,
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
