import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TickerDocument = HydratedDocument<Ticker>;

@Schema()
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
  //todo mongoose date?
}

export const TickerSchema = SchemaFactory.createForClass(Ticker);