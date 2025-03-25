import { Module } from '@nestjs/common';
import { CreateUserController } from './commands/create-user/create-user.controller';
import { CreateUserService } from './commands/create-user/create-user-service';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [CqrsModule],
  controllers: [CreateUserController],
  providers: [CreateUserService],
})
export class UserModule {}
