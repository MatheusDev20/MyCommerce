import { Command, CommandProps } from 'src/libs/command';

export class EditProductCommand extends Command {
  readonly productId: string;
  readonly name?: string | undefined;
  readonly description?: string | undefined;
  readonly price?: number | undefined;
  readonly stockQuantity?: number | undefined;
  readonly category?: string | undefined;
  readonly brand?: string | undefined;
  readonly weight?: number | undefined;
  readonly width?: number | undefined;
  readonly height?: number | undefined;
  readonly length?: number | undefined;
  readonly isActive?: boolean | undefined;

  constructor(props: CommandProps<EditProductCommand>) {
    super(props);
    this.productId = props.productId;
    this.name = props.name;
    this.description = props.description;
    this.price = props.price;
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
