import { Injectable, Logger } from '@nestjs/common';
import { CurrenciesRateScrapper } from './currenciesRate.scrapper';
import { CurrencyRate, CurrencyType } from './schema/currencyRate.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class CurrenciesService {
  private readonly currenciesRateScrapper = new CurrenciesRateScrapper();
  constructor(@InjectModel(CurrencyRate.name) private currencyRateModel: Model<CurrencyRate>) {}
  private readonly _logger = new Logger(CurrenciesService.name);

  async getCurrencyRate(from: CurrencyType, to: CurrencyType) {
    if (from === to) return 1;
    let result;
    const currencyRateDocument = await this.currencyRateModel.findOne({
      $or: [{ currencyRateString: from + to }, { currencyRateString: to + from }],
    });
    if (!currencyRateDocument) {
      result = await this.currenciesRateScrapper.getCurrencyRate(from, to);
      if (!result) {
        console.log('no scrapping result');
        return;
      }
      this._logger.log('saving new currency in db: ' + from + to);
      const cr = new this.currencyRateModel({ currencyRateString: from + to, rate: result });
      await cr.save();
      return result;
    }
    // @ts-ignore
    const dateString = currencyRateDocument.updatedAt;
    const dateObject = new Date(dateString);
    const differenceInHours = Math.abs(Date.now() - dateObject.getTime()) / (1000 * 60 * 60);

    if (differenceInHours > 24) {
      this._logger.debug('currency found with obsolete data; scrapping...');
      result = await this.currenciesRateScrapper.getCurrencyRate(from, to);
      if (result) {
        currencyRateDocument.rate = result;
        await currencyRateDocument.save();
      }
    }

    return currencyRateDocument.currencyRateString === from + to
      ? currencyRateDocument.rate
      : 1 / currencyRateDocument.rate;
  }
}
