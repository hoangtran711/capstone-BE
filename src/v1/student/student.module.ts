import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ProjectSchedule,
  ProjectScheduleSchema,
} from '@schemas/project-schedule.schema';
import { Project, ProjectSchema } from '@schemas/project.schema';
import { StudentJoin, StudentJoinSchema } from '@schemas/student-join.schema';

import { DisabledUserModule } from 'v1/disabled-user/disabled-user.module';
import { UsersModule } from 'v1/users/users.module';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';

@Module({
  providers: [StudentService],
  exports: [StudentService],
  imports: [
    MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }]),
    MongooseModule.forFeature([
      { name: StudentJoin.name, schema: StudentJoinSchema },
    ]),
    MongooseModule.forFeature([
      { name: ProjectSchedule.name, schema: ProjectScheduleSchema },
    ]),
    UsersModule,
    DisabledUserModule,
  ],
  controllers: [StudentController],
})
export class StudentModule {}
