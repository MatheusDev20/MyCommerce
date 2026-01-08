import { Query, QueryProps } from 'src/libs/query.base';

export class GetProductQuery extends Query {
  readonly productId: string;

  constructor(props: QueryProps<GetProductQuery>) {
    super(props);
    this.productId = props.productId;
  }
}
