import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = UserSchema & Document;

@Schema()
export class UserSchema {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  dateOfBirth: Date;

  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  phoneNumber: string;
}

export const UserSchemaSchema = SchemaFactory.createForClass(UserSchema);
