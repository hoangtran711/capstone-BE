import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TaskDocument = Task & Document;

@Schema()
export class Task {
  @Prop({ required: true })
  projectId: string;

  @Prop()
  submmited: {
    userId: string;
    createAt: string;
    files: string[];
    comment: string;
  }[];

  @Prop()
  files: string[];

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  startTime: string;

  @Prop({ required: true })
  endTime: string;

  @Prop({ required: true })
  createdBy: string;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
