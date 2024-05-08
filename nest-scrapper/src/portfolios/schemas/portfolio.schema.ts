import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type PortfolioDocument = HydratedDocument<Portfolio>;

@Schema()
export class Portfolio {

  @Prop()
  title: string;
  @Prop()
  currency: string;
  @Prop()
  totalValue: number;
  @Prop()
  categories: { category: string; value: number }[];
  @Prop()
  accounts: {id:string, title: string; cash: number; assets: any[] }[];
}

export const PortfolioSchema = SchemaFactory.createForClass(Portfolio);
