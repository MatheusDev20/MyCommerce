import { Command, CommandProps } from 'src/libs/command';

export class CreateUserCommand extends Command {
  readonly email: string;
  readonly password: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly phoneNumber: string;
  readonly shippingAddress: string;
  readonly isShippingAddressSameAsBilling: boolean;
  readonly billingAddress: string;

  constructor(props: CommandProps<CreateUserCommand>) {
    super(props);
    this.email = props.email;
    this.password = props.password;
    this.firstName = props.firstName;
    this.lastName = props.lastName;
    this.phoneNumber = props.phoneNumber;
    this.shippingAddress = props.shippingAddress;
    this.isShippingAddressSameAsBilling = props.isShippingAddressSameAsBilling;
    this.billingAddress = props.billingAddress;
  }
}
