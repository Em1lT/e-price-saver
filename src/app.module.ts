import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksService } from './tasks/task.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma.service';

@Module({
  imports: [ConfigModule.forRoot(), ScheduleModule.forRoot()],
  controllers: [],
  providers: [TasksService, PrismaService],
})
export class AppModule {}
