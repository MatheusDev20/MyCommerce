import { Injectable } from '@nestjs/common';
import { UserRepositoryPort } from './user-repository.port';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '../../domain/user.entity';

@Injectable()
export class PrismaUserRepository implements UserRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async persist(user: User): Promise<void> {
    const props = user.getProps();
    const addressProps = user.getAddresses();

    await this.prisma.user.create({
      data: {
        id: props.id,
        firstName: props.firstName,
        lastName: props.lastName,
        email: props.email,
        password: props.password,
        addresses: {
          create: addressProps.map((addr) => ({
            id: addr.id,
            street: addr.street,
            city: addr.city,
            state: addr.state,
            country: addr.country,
            zipCode: addr.zipCode,
            type: addr.type,
          })),
        },
      },
    });
  }
}
