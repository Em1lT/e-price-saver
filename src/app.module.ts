import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import ElectricityPrice from './electricity/electricity.entity';
import { ElectricityModule } from './electricity/electricity.module';

const migrationsDir =
  process.env.NODE_ENV === 'production' ? 'migrations-prod' : 'migrations-dev';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: process.env.DATABASE_URL,
      synchronize: false,
      entities: [ElectricityPrice],
      logging: process.env.SQL_DEBUG === 'true' ? 'all' : ['error', 'warn'],
      migrations: process.env.RUN_MIGRATIONS
        ? [`${migrationsDir}/*{.ts,.js}`]
        : [],
    }),
    ElectricityModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
