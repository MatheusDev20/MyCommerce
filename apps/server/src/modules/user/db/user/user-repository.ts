import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '../../domain/user.entity';
import { UserRepository } from 'src/libs/ports/repository.port';
import { UserMapper } from '../../user.mapper';
import { Prisma } from '@repo/db';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: UserMapper,
  ) {}

  async insert(user: User): Promise<User> {
    const record = this.mapper.toPersistence(user);
    const createdUser = await this.prisma.user.create({
      data: record,
      include: { addresses: true },
    });

    return this.mapper.toDomain(createdUser);
  }

  async findUnique(where: Prisma.UserWhereUniqueInput): Promise<User | null> {
    const entity = await this.prisma.user.findUnique({
      where,
      include: { addresses: true },
    });

    return entity ? this.mapper.toDomain(entity) : null;
  }
}
