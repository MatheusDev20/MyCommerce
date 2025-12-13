import { CommandHandler } from '@nestjs/cqrs';
import { LoginCommand } from './command';

@CommandHandler(LoginCommand)
export class LoginHandler {
  constructor() {}
  async execute(command: LoginCommand): Promise<any> {
    const { email, password, metadata } = command;

    // const user = await this.userRepository(email);
  }
}
