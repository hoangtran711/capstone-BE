import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { LeaveStatus } from 'shared/enums/leave.enum';

export type StudentSchedulesDocument = StudentSchedules & Document;

@Schema()
export class StudentSchedules {
  @Prop({ required: true })
  studentId: string;

  @Prop({ required: true })
  schedules: {
    projectId: string;
    times: {
      date: string;
      totalLesson: number;
      atHour: number;
      atMinute: number;
      atSecond: number;
      attendaceAfter: number;
      leave: LeaveStatus;
    }[];
  }[];
}

export const StudentSchedulesSchema =
  SchemaFactory.createForClass(StudentSchedules);
