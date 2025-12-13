import { BaseEntityProps, Entity } from 'src/libs/entity.base';
import { randomUUID } from 'crypto';

export type AddressProps = {
  street: string;
  city: string;
  state: string;
  type: 'BILLING' | 'SHIPPING';
  country: string;
  zipCode: string;
};

export type RehydrateAddressProps = {
  id: string;
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  type: 'BILLING' | 'SHIPPING';
  createdAt: Date;
  updatedAt: Date;
};

export class Address extends Entity<AddressProps> {
  static create(props: AddressProps) {
    const id = randomUUID();

    return new Address({ id, props });
  }

  static rehydrate(props: AddressProps & BaseEntityProps): Address {
    return new Address({
      id: props.id,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
      props,
    });
  }

  public validate(): void {
    if (this.props.street.length > 50) throw new Error('Too long street');
  }
}
