import { CreateUserProps } from './user.type';
import { Entity } from 'src/libs/entity.base';
import { randomUUID } from 'crypto';
import { Address, RehydrateAddressProps } from './address.entity';

type UserProps = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  addresses: Address[];
  role: 'CUSTOMER' | 'ADMIN';
};

type RehydrateUserProps = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  addresses: RehydrateAddressProps[];
  role: 'CUSTOMER' | 'ADMIN';
};

export class User extends Entity<UserProps> {
  static create(create: CreateUserProps): User {
    return new User({
      id: randomUUID(),
      props: {
        email: create.email,
        password: create.password,
        firstName: create.firstName,
        lastName: create.lastName,
        addresses: create.addresses.map(Address.create),
        role: 'CUSTOMER',
      },
    });
  }

  static rehydrate(raw: RehydrateUserProps): User {
    return new User({
      id: raw.id,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      props: {
        email: raw.email,
        password: raw.password,
        firstName: raw.firstName,
        lastName: raw.lastName,
        addresses: raw.addresses.map(Address.rehydrate),
        role: raw.role,
      },
    });
  }

  validate(): void {
    // invariants only
  }
}
