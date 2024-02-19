import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TelegramModule } from 'nestjs-telegram';
import { TasksService } from '../tasks/task.service';
import { TelegramMessageService } from '../telegram/telegram.service';
import ElectricityPrice from './electricity.entity';
import { ElectricityService } from './electricity.service';
import { PorssiSahkoIntegration } from './integration/porssisahko.integration';

@Module({
  imports: [
    TypeOrmModule.forFeature([ElectricityPrice]),
    TelegramModule.forRoot({
      botKey: process.env.TELEGRAM_API_KEY,
    }),
  ],
  controllers: [],
  providers: [
    TasksService,
    ElectricityService,
    PorssiSahkoIntegration,
    TelegramMessageService,
  ],
})
export class ElectricityModule {}
