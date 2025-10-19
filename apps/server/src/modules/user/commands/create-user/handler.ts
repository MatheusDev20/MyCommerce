import { PrismaUserRepository } from '../../db/user/user-repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from './command';
import { AddressRepository } from '../../db/address/address.repository';
import { User } from '../../domain/user.entity';

@CommandHandler(CreateUserCommand)
export class CreateUserService implements ICommandHandler<CreateUserCommand> {
  constructor(
    private readonly userRepository: PrismaUserRepository,
    private readonly addressRepository: AddressRepository,
  ) {}

  async execute(command: CreateUserCommand): Promise<void> {
    const { addresses, ...userData } = command;
    const user = new User({ ...userData, addresses });
    await this.userRepository.persist(user);
  }
}
