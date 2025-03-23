import { Command, CommandProps } from 'src/libs/command';

export class CreateUserCommand extends Command {
  readonly email: string;
  readonly pasword: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly phoneNumber: string;
  readonly shippingAddress: string;
  readonly isShippingAddressSameAsBilling: boolean;

  constructor(props: CommandProps<CreateUserCommand>) {
    super(props);
    this.email = props.email;
    this.pasword = props.pasword;
    this.firstName = props.firstName;
    this.lastName = props.lastName;
    this.phoneNumber = props.phoneNumber;
    this.shippingAddress = props.shippingAddress;
    this.isShippingAddressSameAsBilling = props.isShippingAddressSameAsBilling;
  }
}
