import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
import { UsersModule } from './users/users.module';
import { StudentModule } from './student/student.module';
import { RequestsModule } from './requests/requests.module';
import { UploadsModule } from './uploads/uploads.module';
import { ProjectJoinedModule } from './project-joined/project-joined.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ProjectsModule,
    StudentModule,
    RequestsModule,
    UploadsModule,
    ProjectJoinedModule,
  ],
  controllers: [],
  providers: [],
})
export class V1Module {}
