import { Command, CommandProps } from 'src/libs/command';

export class AddProductCommand extends Command {
  readonly name: string;
  readonly description: string;
  readonly price: number;
  readonly sku: string;
  readonly stockQuantity: number;
  readonly category: string;
  readonly brand?: string | undefined;
  readonly weight?: number | undefined;
  readonly width?: number | undefined;
  readonly height?: number | undefined;
  readonly length?: number | undefined;
  readonly isActive?: boolean | undefined;

  constructor(props: CommandProps<AddProductCommand>) {
    super(props);
    this.name = props.name;
    this.description = props.description;
    this.price = props.price;
    this.sku = props.sku;
    this.stockQuantity = props.stockQuantity;
    this.category = props.category;
    this.brand = props.brand;
    this.weight = props.weight;
    this.width = props.width;
    this.height = props.height;
    this.length = props.length;
    this.isActive = props.isActive;
  }
}
