import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteUserCommand } from './command';
import { Inject, NotFoundException } from '@nestjs/common';
import { UserRepository } from 'src/libs/ports/repository.port';

@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand> {
  constructor(
    @Inject('UserRepository') private readonly userRepository: UserRepository,
  ) {}

  async execute(command: DeleteUserCommand): Promise<{ id: string }> {
    const { userId } = command;
    const existingUser = await this.userRepository.findUnique({ id: userId });

    if (!existingUser) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    await this.userRepository.delete(userId);

    return { id: userId };
  }
}
