import { Query, QueryProps } from 'src/libs/query.base';

export class QueryUserProfileCommand extends Query {
  readonly userId: string;

  constructor(props: QueryProps<QueryUserProfileCommand>) {
    super(props);
    this.userId = props.userId;
  }
}
