import { Command, CommandProps } from 'src/libs/command';

export class DeleteProductCommand extends Command {
  readonly productId: string;

  constructor(props: CommandProps<DeleteProductCommand>) {
    super(props);
    this.productId = props.productId;
  }
}
