import { v4 } from 'uuid';
import { CreateUserProps } from './user.type';
import { Address, AddressBase } from './address.entity';
import { Entity } from 'src/libs/entity.base';

export class User extends Entity<CreateUserProps> {
  private readonly addresses: Address[];

  constructor(props: CreateUserProps) {
    const id = v4();

    super({ id, props });
    this.addresses = this.instantiateAddresses(props.addresses);
    this.validate();
  }

  private instantiateAddresses(addressData: AddressBase[]): Address[] {
    const shipping = addressData.find((a) => a.type === 'SHIPPING');
    const billing = addressData.find((a) => a.type === 'BILLING');

    if (!shipping && !billing)
      throw new Error(
        "At least one address of type 'SHIPPING' or 'BILLING' is required",
      );

    return addressData.map((addr) => new Address(addr, v4()));
  }

  public getAddresses() {
    const props = this.addresses.map((addr) => addr.getProps());
    return props;
  }

  validate(): void {}
}
