import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProjectDocument = Project & Document;

@Schema()
export class Project {
  @Prop({ required: true })
  projectName: string;

  @Prop({ required: true })
  projectDescription: string;

  @Prop({ required: true })
  startDate: string;

  @Prop({ required: true })
  endDate: string;

  @Prop({ required: true })
  learnDate: {
    dayOfWeek: number;
    atHour: number;
    atMinute: number;
    atSecond: number;
  }[];

  @Prop({ required: true, default: 0 })
  attendanceAfterMinute: number;

  @Prop({ required: true })
  createdBy: string;

  @Prop({ required: true })
  maxJoin: number;

  @Prop({ required: true })
  joined: number;

  @Prop({ required: true })
  totalLesson: number;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
