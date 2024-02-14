import { DataSourceOptions } from 'typeorm';
import ElectricityPrice from '../electricity/electricity.entity';

const migrationsDir =
  process.env.NODE_ENV === 'production' ? 'migrations-prod' : 'migrations-dev';
// Check typeORM documentation for more information.
export const config: DataSourceOptions = {
  type: 'sqlite',
  database: process.env.DATABASE_URL,
  synchronize: false,
  entities: [ElectricityPrice],
  logging: process.env.SQL_DEBUG === 'true' ? 'all' : ['error', 'warn'],
  migrations: process.env.RUN_MIGRATIONS ? [`${migrationsDir}/*{.ts,.js}`] : [],
};
