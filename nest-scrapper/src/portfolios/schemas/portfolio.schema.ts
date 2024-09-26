import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Asset } from 'src/common/types/portfolioAsset.type';
import { CurrencyType } from 'src/general/currencies/schema/currencyRate.schema';

export type PortfolioDocument = HydratedDocument<Portfolio>;

export type OperationType = 'sell' | 'buy' | 'withdraw' | 'deposit';


@Schema()
export class Portfolio {
  @Prop()
  title: string;
  @Prop()
  currency: CurrencyType;
  @Prop()
  totalValue: number;
  @Prop()
  freeCash: number;
  @Prop()
  categories: { category: string; value: number }[];
  @Prop()
  operationHistory: {
    id: string;
    accountName: string;
    type: OperationType;
    amount: number;
    date: Date;
    asset?: string;
    quantity?: number;
    buyDate?: Date;
  }[];
  @Prop()
  accounts: { id: string; title: string; cash: number }[];


  @Prop()
  assets: Asset[]
}

export const PortfolioSchema = SchemaFactory.createForClass(Portfolio);
