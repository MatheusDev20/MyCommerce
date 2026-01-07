import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EditUserCommand } from './command';
import { Inject, NotFoundException } from '@nestjs/common';
import { UserRepository } from 'src/libs/ports/repository.port';
import { User } from '../../domain/user.entity';
import { Address } from '../../domain/address.entity';

@CommandHandler(EditUserCommand)
export class EditUserHandler implements ICommandHandler<EditUserCommand> {
  constructor(
    @Inject('UserRepository') private readonly userRepository: UserRepository,
  ) {}

  async execute(command: EditUserCommand): Promise<{ id: string }> {
    const { userId, metadata, ...updateData } = command;

    const existingUser = await this.userRepository.findUnique({ id: userId });

    if (!existingUser) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    const currentProps = existingUser.getProps();

    // Prepare addresses - create new ones if provided, otherwise keep existing
    const addresses = updateData.addresses
      ? updateData.addresses.map(Address.create)
      : currentProps.addresses;

    // Create updated user entity by rehydrating with merged data
    const updatedUser = User.rehydrate({
      id: currentProps.id,
      createdAt: currentProps.createdAt,
      updatedAt: new Date(),
      email: currentProps.email,
      password: currentProps.password,
      firstName: updateData.firstName ?? currentProps.firstName,
      lastName: updateData.lastName ?? currentProps.lastName,
      addresses: addresses.map((addr) => addr.getProps()),
      role: currentProps.role,
    });

    await this.userRepository.update(updatedUser);

    return { id: userId };
  }
}
