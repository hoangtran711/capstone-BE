import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { RequestStatus, RequestType } from 'shared/enums/request.enum';

export type RequestDocument = Request & Document;

@Schema()
export class Request {
  @Prop({ required: true })
  projectId: string;

  @Prop({ required: true })
  userId: string;

  @Prop()
  date?: string;

  @Prop({})
  proof?: string[];

  @Prop()
  reason?: string;

  @Prop({ required: true })
  status: RequestStatus;

  @Prop({ required: true })
  type: RequestType;

  @Prop({ required: true })
  approver: string;
}

export const RequestSchema = SchemaFactory.createForClass(Request);
