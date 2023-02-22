import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type StudentDisabledDocument = StudentDisabled & Document;

@Schema()
export class StudentDisabled {
  @Prop({ required: true })
  projectId: string;

  @Prop({ required: true })
  studentsDisabled: string[];
}

export const StudentDisabledSchema =
  SchemaFactory.createForClass(StudentDisabled);
