import { Command, CommandProps } from 'src/libs/command';

export class DeleteUserCommand extends Command {
  readonly userId: string;

  constructor(props: CommandProps<DeleteUserCommand>) {
    super(props);
    this.userId = props.userId;
  }
}
