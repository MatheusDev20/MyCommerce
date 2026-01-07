/*  Most of repositories will probably need generic 
    save/find/delete operations, so it's easier
    to have some shared interfaces.
    More specific queries should be defined
    in a respective repository.
*/

import { Prisma } from '@repo/db';
import { User } from 'src/modules/user/domain/user.entity';
import { Product } from 'src/modules/product/domain/product.entity';

export class Paginated<T> {
  readonly count: number;
  readonly limit: number;
  readonly page: number;
  readonly data: readonly T[];

  constructor(props: Paginated<T>) {
    this.count = props.count;
    this.limit = props.limit;
    this.page = props.page;
    this.data = props.data;
  }
}

export type OrderBy = { field: string | true; param: 'asc' | 'desc' };

export type PaginatedQueryParams = {
  limit: number;
  page: number;
  offset: number;
  orderBy: OrderBy;
};

export interface UserRepository {
  insert(entity: User): Promise<User>;
  findUnique(where: Prisma.UserWhereUniqueInput): Promise<User | null>;
  update(entity: User): Promise<User>;
  delete(id: string): Promise<void>;
}

export interface ProductRepository {
  insert(entity: Product): Promise<Product>;
  findUnique(where: Prisma.ProductWhereUniqueInput): Promise<Product | null>;
}
