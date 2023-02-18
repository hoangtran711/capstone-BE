import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
import { UsersModule } from './users/users.module';
import { StudentModule } from './student/student.module';
import { RequestsController } from './requests/requests.controller';
import { RequestsService } from './requests/requests.service';
import { RequestsModule } from './requests/requests.module';

@Module({
  imports: [AuthModule, UsersModule, ProjectsModule, StudentModule, RequestsModule],
  controllers: [RequestsController],
  providers: [RequestsService],
})
export class V1Module {}
