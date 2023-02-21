import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectsService } from './projects.service';
import { Project, ProjectSchema } from 'schemas';
import { ProjectsController } from './projects.controller';
import { ProjectJoinedModule } from 'v1/project-joined/project-joined.module';
import { UsersModule } from 'v1/users/users.module';
import { StudentModule } from 'v1/student/student.module';

@Module({
  providers: [ProjectsService],
  exports: [ProjectsService],
  imports: [
    MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }]),
    ProjectJoinedModule,
    UsersModule,
    StudentModule,
  ],
  controllers: [ProjectsController],
})
export class ProjectsModule {}
