import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksService } from './tasks/task.service';
import { ConfigModule } from '@nestjs/config';
import { TelegramModule } from 'nestjs-telegram';
import { TelegramMessageService } from './telegram/telegram.service';
import { ElectricityService } from './electricity/electricity.service';
import { PorssiSahkoIntegration } from './electricity/integration/porssisahko.integration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from './common/ormGlobalConfigs';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot(config),
    TelegramModule.forRoot({
      botKey: process.env.TELEGRAM_API_KEY,
    }),
  ],
  controllers: [],
  providers: [
    TasksService,
    TelegramMessageService,
    ElectricityService,
    PorssiSahkoIntegration,
  ],
})
export class AppModule {}
