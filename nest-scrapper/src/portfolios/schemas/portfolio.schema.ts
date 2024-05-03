import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type PortfolioDocument = HydratedDocument<Portfolio>;

@Schema()
export class Portfolio {
  //id?
//   @Prop({ type: Types.ObjectId, ref: 'users' }) // Define userId field as ObjectId reference to User collection
//   userId: Types.ObjectId; // Use Types.ObjectId type

  @Prop()
  title: string;
  @Prop()
  currency: string;
  @Prop()
  totalValue: number;
  @Prop()
  categories: { category: string; value: number }[];
  @Prop()
  accounts: { title: string; cash: number; assets: any[] }[];
}

export const PortfolioSchema = SchemaFactory.createForClass(Portfolio);
