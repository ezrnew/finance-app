import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type PortfolioDocument = HydratedDocument<Portfolio>;

export type OperationType = 'sell' | 'buy' | 'withdraw' | 'deposit';
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
  @Prop() //todo addPaymentAdded info
  operationHistory: {id:string; accountName: string; type: OperationType; amount: number; date: Date; asset?: string; quantity?:number; buyDate?:Date }[];
  @Prop()
  accounts: { id: string; title: string; cash: number; assets: any[] }[];
}

export const PortfolioSchema = SchemaFactory.createForClass(Portfolio);
