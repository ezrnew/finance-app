import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { CurrencyType } from 'src/currencies/schema/currencyRate.schema';

export type TickerDocument = HydratedDocument<Ticker>;

@Schema({ timestamps: true })
export class Ticker {
  @Prop()
  name: string;

  @Prop()
  currency: CurrencyType;

  @Prop()
  price: number;

  @Prop()
  stockMarket?: string;

  @Prop()
  date: Date;

  @Prop()
  createdAt: string;

  @Prop()
  updatedAt: string;
}

export const TickerSchema = SchemaFactory.createForClass(Ticker);
