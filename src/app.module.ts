import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksService } from './tasks/task.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [],
  providers: [TasksService],
})
export class AppModule {}
