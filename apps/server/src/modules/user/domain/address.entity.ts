import { Entity } from 'src/libs/entity.base';
import { v4 } from 'uuid';
import { ZipCode } from './vo/zip-code';

type AddressBase = {
  userId: string;
  street: string;
  city: string;
  state: string;
  type: 'BILLING' | 'SHIPPING';
  country: string;
};

type CreateAddressInput = AddressBase & {
  zipCode: string;
};

type CreateAddressProps = AddressBase & {
  zipCode: ZipCode;
};

export class Address extends Entity<CreateAddressProps> {
  static create(create: CreateAddressInput): Address {
    const id = v4();

    const props = {
      ...create,
      zipCode: new ZipCode(create.zipCode),
    };

    const address = new Address({ id, props });
    return address;
  }

  validate(): void {
    console.log('Validating address');
    // if (this.props.street.length > 6) throw new Error('Too long street');
  }
}
