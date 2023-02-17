import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';
import { RequestStatus } from 'shared/enums/request.enum';

export type RequestDocument = Request & Document;

@Schema()
export class Request {
  @Prop({ required: true })
  projectId: ObjectId;

  @Prop({ required: true })
  reason: Request;

  @Prop({ required: true })
  status: RequestStatus;
}

export const RequestSchema = SchemaFactory.createForClass(Request);
