import { ObjectId } from 'mongoose';
import { AssetType } from 'src/common/types/portfolioAsset.type';
import { CurrencyType } from 'src/general/currencies/schema/currencyRate.schema';

export class BuyAssetDto {
  portfolioId: string;
  category: string;
  accountId: string;

  asset: { name: string; type: AssetType };
  date: Date;
  currency: CurrencyType;
  currencyRate: number;
  price: number;
  quantity: number;
  paymentAdded: boolean;
}
