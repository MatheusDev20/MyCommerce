/* eslint-disable @typescript-eslint/no-unused-vars */
import { PrismaUserRepository } from '../../db/user/user-repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from './command';
import { User } from '../../domain/user.entity';
import { HttpException, Inject } from '@nestjs/common';
import { Hashing } from 'src/modules/auth/ports/hashing.port';
import { UserRepository } from 'src/libs/ports/repository.port';

@CommandHandler(CreateUserCommand)
export class CreateUserService implements ICommandHandler<CreateUserCommand> {
  constructor(
    @Inject('UserRepository') private readonly userRepository: UserRepository,
    @Inject('Hashing') private readonly passwordHasher: Hashing,
  ) {}

  async execute(command: CreateUserCommand): Promise<{ id: string }> {
    const { metadata, ...userData } = command;

    const { email } = userData;

    const existingUser = await this.userRepository.findUnique({ email });

    if (existingUser)
      throw new HttpException('User with this email already exists', 400);

    const createData = {
      ...userData,
      password: await this.passwordHasher.hash(userData.password),
    };

    const user = User.create({ ...createData });
    const createdUser = await this.userRepository.insert(user);
    const userId = createdUser.getProps().id;

    return { id: userId };
  }
}
