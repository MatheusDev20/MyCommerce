import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class UserRepository {
  constructor(@Inject('KNEX_CONNECTION') private readonly db) {}

  async find() {
    const data = await this.db('users').select('*');
  }
}
