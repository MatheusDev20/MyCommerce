import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { UserModule } from './modules/user/user.module';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaModule } from './prisma/prisma.module';
import { ProductModule } from './modules/product/product.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    CacheModule.register(),
    CqrsModule,
    AuthModule,
    UserModule,
    ProductModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
