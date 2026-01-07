import { Command, CommandProps } from 'src/libs/command';
import { AddressDTO } from 'src/modules/user/schemas/address';

export class EditUserCommand extends Command {
  readonly userId: string;
  readonly firstName?: string | undefined;
  readonly lastName?: string | undefined;
  readonly addresses?: AddressDTO[] | undefined;

  constructor(props: CommandProps<EditUserCommand>) {
    super(props);
    this.userId = props.userId;
    this.firstName = props.firstName;
    this.lastName = props.lastName;
    this.addresses = props.addresses;
  }
}
