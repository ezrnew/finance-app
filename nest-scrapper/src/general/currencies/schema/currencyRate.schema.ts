import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CurrencyRateDocument = HydratedDocument<CurrencyRate>;
export type CurrencyType = 'PLN' | 'GBP' | 'USD' | 'EUR';

@Schema({ timestamps: true })
export class CurrencyRate {
  @Prop()
  currencyRateString: string;

  @Prop()
  rate: number;
}

export const CurrencyRateSchema = SchemaFactory.createForClass(CurrencyRate);
