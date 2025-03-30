import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from './create-user.command';

@CommandHandler(CreateUserCommand)
export class CreateUserService implements ICommandHandler<CreateUserCommand> {
  constructor() {}
  async execute(command: CreateUserCommand): Promise<void> {
    console.log('Command Executed', command);

    // Create the entity
  }
}
