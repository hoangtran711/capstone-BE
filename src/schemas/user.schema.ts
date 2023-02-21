import { RoleEnum } from '@common/interfaces';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { VerifyStatus } from 'shared/enums/user.enum';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  dateOfBirth: string;

  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop({ required: true })
  uid: string;

  @Prop({})
  address: string;

  @Prop({})
  avatar: string;

  @Prop({ required: true })
  role: RoleEnum;

  @Prop()
  major?: string;

  @Prop({ required: true })
  emailVerified: VerifyStatus;
}

export const UserSchema = SchemaFactory.createForClass(User);
