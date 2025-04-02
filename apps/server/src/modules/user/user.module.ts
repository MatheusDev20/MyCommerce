import { Module } from '@nestjs/common';
import { CreateUserController } from './commands/create-user/create-user.controller';
import { CreateUserService } from './commands/create-user/create-user-service';
import { CqrsModule } from '@nestjs/cqrs';
import { UserRepository } from './db/user-repository';
import { PrismaService } from 'src/libs/prisma/service';

@Module({
  imports: [CqrsModule],
  controllers: [CreateUserController],
  providers: [CreateUserService, UserRepository, PrismaService],
})
export class UserModule {}
