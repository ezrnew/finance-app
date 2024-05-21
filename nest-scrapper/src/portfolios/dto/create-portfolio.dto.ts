import { CurrencyType } from 'src/currencies/schema/currencyRate.schema';

export class CreatePortfolioDto {
  name: string;
  currency: CurrencyType;
}
