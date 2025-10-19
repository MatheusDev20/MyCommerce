import { Entity } from 'src/libs/entity.base';
import { ZipCode } from './vo/zip-code';

export type AddressBase = {
  street: string;
  city: string;
  state: string;
  type: 'BILLING' | 'SHIPPING';
  country: string;
  zipCode: string;
};

export class Address extends Entity<AddressBase> {
  private readonly zipCode: ZipCode;

  public constructor(props: AddressBase, id: string) {
    super({ id, props });
    this.zipCode = new ZipCode(props.zipCode);
  }

  public validate(): void {
    if (this.props.street.length > 100) throw new Error('Too long street');
  }
}
