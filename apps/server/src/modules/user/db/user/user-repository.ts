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

  async update(user: User): Promise<User> {
    const props = user.getProps();

    const updatedUser = await this.prisma.$transaction(async (tx) => {
      await tx.address.deleteMany({
        where: { userId: props.id },
      });

      const updated = await tx.user.update({
        where: { id: props.id },
        data: {
          email: props.email,
          firstName: props.firstName,
          lastName: props.lastName,
          password: props.password,
          updatedAt: props.updatedAt,
          addresses: {
            create: props.addresses.map((addr) => {
              const addrProps = addr.getProps();
              return {
                street: addrProps.street,
                city: addrProps.city,
                state: addrProps.state,
                country: addrProps.country,
                zipCode: addrProps.zipCode,
                type: addrProps.type,
              };
            }),
          },
        },
        include: { addresses: true },
      });

      return updated;
    });

    return this.mapper.toDomain(updatedUser);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      // Delete related addresses first
      await tx.address.deleteMany({
        where: { userId: id },
      });

      // Delete related refresh tokens
      await tx.refreshToken.deleteMany({
        where: { userId: id },
      });

      // Finally delete the user
      await tx.user.delete({
        where: { id },
      });
    });
  }
}
