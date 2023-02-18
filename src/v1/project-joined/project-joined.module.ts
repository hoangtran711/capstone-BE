import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentJoin, StudentJoinSchema } from '@schemas/student-join.schema';
import { UsersModule } from 'v1/users/users.module';
import { ProjectJoinedController } from './project-joined.controller';
import { ProjectJoinedService } from './project-joined.service';

@Module({
  providers: [ProjectJoinedService],
  exports: [ProjectJoinedService],
  imports: [
    MongooseModule.forFeature([
      { name: StudentJoin.name, schema: StudentJoinSchema },
    ]),
    UsersModule,
  ],
  controllers: [ProjectJoinedController],
})
export class ProjectJoinedModule {}
