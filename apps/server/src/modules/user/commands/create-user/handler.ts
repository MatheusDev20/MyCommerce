import { PrismaUserRepository } from '../../db/user/user-repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from './command';
import { User } from '../../domain/user.entity';
import { HttpException } from '@nestjs/common';

@CommandHandler(CreateUserCommand)
export class CreateUserService implements ICommandHandler<CreateUserCommand> {
  constructor(private readonly userRepository: PrismaUserRepository) {}

  async execute(command: CreateUserCommand): Promise<{ id: string }> {
    const { addresses, ...userData } = command;
    const { email } = userData;
    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser)
      throw new HttpException('User with this email already exists', 400);

    const user = new User({ ...userData, addresses });
    const { id } = await this.userRepository.persist(user);

    return { id };
  }
}
