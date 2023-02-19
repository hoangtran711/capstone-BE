import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from '@schemas/task-schema';
import { ProjectJoinedModule } from 'v1/project-joined/project-joined.module';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
    ProjectJoinedModule,
  ],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
