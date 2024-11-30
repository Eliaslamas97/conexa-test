import { Module } from '@nestjs/common';
import { databaseProviders } from '@src/database/postgres/database.service';

@Module({
  providers: [],
  imports: [...databaseProviders],
  exports: [...databaseProviders],
})
export class DatabaseModule {}
