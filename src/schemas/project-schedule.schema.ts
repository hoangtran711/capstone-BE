import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProjectScheduleDocument = ProjectSchedule & Document;
export type ScheduleDocument = Schedule & Document;

@Schema()
export class Schedule {
  @Prop({ required: true })
  startTime: string;

  @Prop({ required: true })
  endTime: string;

  @Prop({
    required: true,
    type: [
      {
        _id: String,
        start: String,
        end: String,
        studentJoined: [{ type: String }],
      },
    ],
  })
  attendanceAt: {
    _id: string;
    start: string;
    end: string;
    studentJoined: string[];
  }[];

  @Prop({ type: { lat: Number, lng: Number } })
  location: { lat: number; lng: number };
}
@Schema()
export class ProjectSchedule {
  @Prop({ required: true })
  projectId: string;

  @Prop({ required: true })
  schedules: Schedule[];
}

export const ProjectScheduleSchema =
  SchemaFactory.createForClass(ProjectSchedule);

export const ScheduleSchema = SchemaFactory.createForClass(Schedule);
