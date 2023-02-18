import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { RequestStatus } from 'shared/enums/request.enum';

export type RequestDocument = Request & Document;

@Schema()
export class Request {
  @Prop({ required: true })
  projectId: string;

  @Prop({ required: true })
  date: string;

  @Prop({ required: true })
  proof: string[];

  @Prop({ required: true })
  reason: Request;

  @Prop({ required: true })
  status: RequestStatus;
}

export const RequestSchema = SchemaFactory.createForClass(Request);
