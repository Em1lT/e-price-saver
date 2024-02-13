import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksService } from './tasks/task.service';
import { ConfigModule } from '@nestjs/config';
import { TelegramModule } from 'nestjs-telegram';
import { TelegramMessageService } from './telegram/telegram.service';
import { ElectricityService } from './electricity/electricity.service';
import { PorssiSahkoIntegration } from './electricity/integration/porssisahko.integration';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
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
