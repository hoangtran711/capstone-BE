import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AttendanceDocument = Attendance & Document;

@Schema()
export class Attendance {
  @Prop({ required: true })
  projectId: string;
  @Prop({ required: true })
  userId: string;
  @Prop({ required: true })
  attendanceId: string;

  @Prop()
  status: string;
}

export const AttendanceSchema = SchemaFactory.createForClass(Attendance);
