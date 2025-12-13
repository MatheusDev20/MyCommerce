import { Command } from 'src/libs/command';

export class LoginCommand extends Command {
  readonly email: string;
  readonly password: string;

  constructor(props: { email: string; password: string }) {
    super({});
    this.email = props.email;
    this.password = props.password;
  }
}
