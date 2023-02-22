import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  StudentDisabled,
  StudentDisabledSchema,
} from '@schemas/student-disabled.schema';
import { UsersModule } from 'v1/users/users.module';
import { DisabledUserController } from './disabled-user.controller';
import { DisabledUserService } from './disabled-user.service';

@Module({
  controllers: [DisabledUserController],
  providers: [DisabledUserService],
  imports: [
    MongooseModule.forFeature([
      { name: StudentDisabled.name, schema: StudentDisabledSchema },
    ]),
    UsersModule,
  ],
})
export class DisabledUserModule {}
