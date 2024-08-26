import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { createTickerDto } from './dto/create-ticker.dto';
import { Ticker } from './schemas/ticker.schema';
import { TickersScrapper } from './tickers.scrapper';
import { IsDateOlderThanXHours, isToday } from '../common/utils/date.utils';
import { removeMongoProperties } from '../common/utils/mongoose.utils';
import { ScrapperCurrencyAdapter, StooqCurrencyAdapter } from './utils/currency.adapter';
import { CurrencyType } from '../currencies/schema/currencyRate.schema';
import { CurrenciesService } from '../currencies/currencies.service';

@Injectable()
export class TickersService {
  private readonly _logger = new Logger(TickersService.name);
  private readonly tickerScrapper = new TickersScrapper();

  constructor(
    @InjectModel(Ticker.name) private tickerModel: Model<Ticker>,
    private readonly currenciesService: CurrenciesService,
  ) {}

  async addNew(name: string) {
    name = name.toLowerCase();

    let ticker = await this.tickerModel.findOne({ name });
    if (ticker) return { new: false, data: ticker };
    this._logger.debug('no ticker found; scrapping...');

    const scrappedTicker = await this.tickerScrapper.getTickerData(name);

    ticker = await this.tickerModel.findOne({ name: scrappedTicker.name });

    if (ticker) {
      ticker.price = scrappedTicker.price;
      ticker.date = scrappedTicker.date;

      await ticker.save();

      console.log('TICKER', ticker);
      return { new: false, data: ticker };
    }

    try {
      const createdTicker = new this.tickerModel(scrappedTicker);
      await createdTicker.save();

      return { new: true, data: createdTicker };
    } catch (error) {
      this._logger.error('error saving new ticker:', error);
    }
  }

  async calculateMany(tickerAssets: any, portfCurrency: CurrencyType) {
    if (tickerAssets.length === 0) return [];
    const tickerNames: string[] = tickerAssets.map((item) => item.name);

    let tickers = await this.tickerModel.find({ name: { $in: tickerNames } });

    const promises = tickers.map(async (item) => {
      if (IsDateOlderThanXHours(item.updatedAt, 24)) {
        const updatedData = await this.tickerScrapper.updateTickerData(item.name, item.currency);
        const currencyRate = await this.currenciesService.getCurrencyRate(
          item.currency as CurrencyType,
          portfCurrency,
        );
        const assetItem = tickerAssets.find((item) => item.name === item);

        assetItem.price = updatedData.newPrice * currencyRate;
        assetItem.date = updatedData.newDate;
      }
    });
    await Promise.all(promises);

    return tickerAssets;
  }

  async calculateOne(name: string) {
    let ticker = await this.tickerModel.findOne({ name });

    this._logger.log('Ticker found in db: ' + name);

    if (!ticker) {
      throw new NotFoundException();
    }

    // @ts-ignore
    const dateString = ticker.updatedAt;
    const dateObject = new Date(dateString);
    const differenceInHours = Math.abs(Date.now() - dateObject.getTime()) / (1000 * 60 * 60);

    if (differenceInHours > 24) {
      this._logger.debug('ticker found with obsolete data; scrapping...');
      const scrappedTicker = await this.tickerScrapper.updateTickerData(name, ticker.currency);

      ticker.price = scrappedTicker.newPrice;
      ticker.date = scrappedTicker.newDate;
      ticker.updatedAt = Date.now().toString();
      await ticker.save();

      removeMongoProperties(ticker);
    }

    this._logger.debug('returning ticker:', ticker);
    return ticker;
  }

  async findAll(): Promise<Ticker[]> {
    return this.tickerModel.find().exec();
  }
}
