import { CurrencyType } from 'src/general/currencies/schema/currencyRate.schema';

export class CreatePortfolioDto {
  name: string;
  currency: CurrencyType;
}
