import { Command, CommandProps } from 'src/libs/command';

export class CreateProductCommand extends Command {
  readonly name: string;
  readonly description: string;
  readonly price: number;
  readonly sku: string;
  readonly stockQuantity: number;

  constructor(props: CommandProps<CreateProductCommand>) {
    super(props);
    this.name = props.name;
    this.description = props.description;
    this.price = props.price;
    this.sku = props.sku;
    this.stockQuantity = props.stockQuantity;
  }
}
