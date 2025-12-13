import { Prisma } from '@repo/db/generated/prisma/client';
import { User } from './domain/user.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserMapper {
  toPersistence(entity: User): Prisma.UserCreateInput {
    const props = entity.getProps();

    return {
      id: props.id,
      email: props.email,
      firstName: props.firstName,
      lastName: props.lastName,
      password: props.password,
      avatar: null,

      addresses: {
        create: props.addresses.map((addr) => {
          const addressProps = addr.getProps();
          return {
            id: addressProps.id,
            street: addressProps.street,
            country: addressProps.country,
            type: addressProps.type,

            city: addressProps.city,
            state: addressProps.state,
            zipCode: addressProps.zipCode,
          };
        }),
      },
    };
  }

  toDomain(
    record: Prisma.UserGetPayload<{ include: { addresses: true } }>,
  ): User {
    return User.rehydrate({
      id: record.id,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      email: record.email,
      firstName: record.firstName,
      lastName: record.lastName,
      password: record.password,
      addresses: record.addresses.map((addr) => ({
        street: addr.street,
        city: addr.city,
        state: addr.state,
        id: addr.id,
        createdAt: addr.createdAt,
        updatedAt: addr.updatedAt,
        country: addr.country,
        type: addr.type as 'BILLING' | 'SHIPPING',
        zipCode: addr.zipCode,
      })),
    });
  }
}
