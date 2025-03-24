import { Module } from '@nestjs/common';
import { CreateUserController } from './commands/create-user/create-user.controller';

@Module({
  imports: [],
  controllers: [CreateUserController],
  providers: [],
})
export class UserModule {}
