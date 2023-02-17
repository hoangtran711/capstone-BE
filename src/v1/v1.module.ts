import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
import { UsersModule } from './users/users.module';
import { StudentModule } from './student/student.module';

@Module({
  imports: [AuthModule, UsersModule, ProjectsModule, StudentModule],
  controllers: [],
  providers: [],
})
export class V1Module {}
