import { Entity } from 'src/libs/entity.base';
import { CreateProductProps } from '../types';
import { v4 } from 'uuid';

type ProductProps = {};
export class Product extends Entity<CreateProductProps> {
  constructor(props: CreateProductProps) {
    const id = v4();

    super({ id, props });
    this.validate();
  }

  validate(): void {}
}
