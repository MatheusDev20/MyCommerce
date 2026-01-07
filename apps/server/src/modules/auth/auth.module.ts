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
import { SessionRepository } from './db/session/session-repository';
import { RefreshTokenController } from './commands/refresh-token/controller';
import { RefreshTokenHandler } from './commands/refresh-token/handler';

@Module({
  controllers: [LoginController, RefreshTokenController],
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
    {
      provide: 'SessionRepository',
      useClass: SessionRepository,
    },
    LoginHandler,
    RefreshTokenHandler,
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
