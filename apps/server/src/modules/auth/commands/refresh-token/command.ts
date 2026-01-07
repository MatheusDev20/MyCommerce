import { Response } from 'express';
import { Command } from 'src/libs/command';

export class RefreshTokenCommand extends Command {
  readonly refreshToken: string;
  readonly res: Response;

  constructor(props: { refreshToken: string; res: Response }) {
    super({});
    this.refreshToken = props.refreshToken;
    this.res = props.res;
  }
}
