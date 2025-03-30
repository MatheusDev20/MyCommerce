// database.module.ts
import { Module } from '@nestjs/common';
import { knexProvider } from '../../libs/knex';

@Module({
  providers: [knexProvider],
  exports: [knexProvider],
})
export class DatabaseModule {}
