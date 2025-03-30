import { Entity } from 'src/libs/entity.base';
import { v4 } from 'uuid';

type CreateAddressProps = {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
};

export class Address extends Entity<CreateAddressProps> {
  static create(create: CreateAddressProps) {
    const id = v4();
    const props: CreateAddressProps = { ...create };

    const address = new Address({ id, props });
  }

  validate(): void {
    if (this.props.street.length > 6) throw new Error('Too long street');
  }
}
