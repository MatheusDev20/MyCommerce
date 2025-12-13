import { AddressProps } from './address.entity';

export type CreateUserProps = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  addresses: AddressProps[];
};
