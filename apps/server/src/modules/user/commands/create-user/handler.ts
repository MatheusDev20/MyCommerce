import { UserRepository } from '../../db/user/user-repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from './command';
import { AddressRepository } from '../../db/address/address.repository';

@CommandHandler(CreateUserCommand)
export class CreateUserService implements ICommandHandler<CreateUserCommand> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly addressRepository: AddressRepository,
  ) {}

  async execute(command: CreateUserCommand): Promise<void> {
    const { addresses, ...userData } = command;
    console.log('userData', userData);
    // Create the entity
  }
}
