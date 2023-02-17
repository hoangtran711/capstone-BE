import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type StudentJoinDocument = StudentJoin & Document;

@Schema()
export class StudentJoin {
  @Prop({ required: true })
  projectId: string;

  @Prop({ required: true })
  studentsJoined: string[];
}

export const StudentJoinSchema = SchemaFactory.createForClass(StudentJoin);
