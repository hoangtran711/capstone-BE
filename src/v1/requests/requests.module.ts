import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { Request, RequestSchema } from '@schemas/request.schema';
import { ProjectsModule } from 'v1/projects/projects.module';
import { StudentModule } from 'v1/student/student.module';
import { RequestsController } from './requests.controller';
import { RequestsService } from './requests.service';

@Module({
  providers: [RequestsService],
  exports: [RequestsService],
  imports: [
    MongooseModule.forFeature([{ name: Request.name, schema: RequestSchema }]),
    MulterModule.register({
      dest: './uploads',
    }),
    StudentModule,
    ProjectsModule,
  ],
  controllers: [RequestsController],
})
export class RequestsModule {}
