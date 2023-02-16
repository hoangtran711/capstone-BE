import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectsService } from './projects.service';
import { Project, ProjectSchema } from 'schemas';
import { ProjectsController } from './projects.controller';

@Module({
  providers: [ProjectsService],
  exports: [ProjectsService],
  imports: [
    MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }]),
  ],
  controllers: [ProjectsController],
})
export class ProjectsModule {}
