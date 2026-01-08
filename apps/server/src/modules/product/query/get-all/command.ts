import { Query, QueryProps } from 'src/libs/query.base';

export class GetAllProductsQuery extends Query {
  constructor(props: QueryProps<GetAllProductsQuery>) {
    super(props);
  }
}
