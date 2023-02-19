import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Project, ProjectSchema } from '@schemas/project.schema';
import { StudentJoin, StudentJoinSchema } from '@schemas/student-join.schema';
import {
  StudentSchedules,
  StudentSchedulesSchema,
} from '@schemas/student-schedule.schema';
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
      { name: StudentSchedules.name, schema: StudentSchedulesSchema },
    ]),
    UsersModule,
  ],
  controllers: [StudentController],
})
export class StudentModule {}
