import { CurrencyType } from 'src/general/currencies/schema/currencyRate.schema';

export type AssetType = 'bond_pltr' | 'ticker';

export type Asset = {
  accountId: string;
  category: string;

  type: AssetType;
  id: string;
  name: string;
  date: Date;
  currency: CurrencyType;
  currencyRate: number;
  buyPrice: number;
  price: number;
  originalCurrencyPrice: number;
  originalCurrencyBuyPrice: number;
  quantity: number;
};

export type AssetWithDay = Asset & {
  day: number;
};
