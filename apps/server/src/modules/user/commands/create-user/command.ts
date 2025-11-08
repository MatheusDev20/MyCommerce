import { Command, CommandProps } from 'src/libs/command';
import { AddressDTO } from 'src/modules/user/schemas/address';

export class CreateUserCommand extends Command {
  readonly email: string;
  readonly password: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly phoneNumber: string;
  readonly addresses: AddressDTO[];

  constructor(props: CommandProps<CreateUserCommand>) {
    super(props);
    this.email = props.email;
    this.password = props.password;
    this.firstName = props.firstName;
    this.lastName = props.lastName;
    this.phoneNumber = props.phoneNumber;
    this.addresses = props.addresses;
  }
}
