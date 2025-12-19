import { Response } from 'express';
import { Command } from 'src/libs/command';

export class LoginCommand extends Command {
  readonly email: string;
  readonly password: string;
  readonly res: Response;

  constructor(props: { email: string; password: string; res: Response }) {
    super({});
    this.email = props.email;
    this.password = props.password;
    this.res = props.res;
  }
}
