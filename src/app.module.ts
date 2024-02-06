import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksService } from './tasks/task.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma.service';
import { TelegramModule } from 'nestjs-telegram';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    TelegramModule.forRoot({
      botKey: process.env.TELEGRAM_API_KEY,
    }),
  ],
  controllers: [],
  providers: [TasksService, PrismaService],
})
export class AppModule {}
