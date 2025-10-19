import { AddressBase } from './address.entity';

export type CreateUserProps = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  addresses: AddressBase[];
};
