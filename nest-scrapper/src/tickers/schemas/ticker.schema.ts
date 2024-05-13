import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TickerDocument = HydratedDocument<Ticker>;

@Schema({timestamps:true})
export class Ticker {
  @Prop()
  name: string;

  @Prop()
  currency: string;
  // todo Currencies model

  @Prop()
  price: number;

  @Prop()
  date: Date;

  @Prop()
  createdAt: string;
  
  @Prop()
  updatedAt: string;
}

export const TickerSchema = SchemaFactory.createForClass(Ticker);