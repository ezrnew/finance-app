import { Injectable, Logger } from '@nestjs/common';
import puppeteer, { Page } from 'puppeteer';
import { getById, getByIdAndText, getByText, getText, setPageCookies } from '../common/utils/puppeteer.utils';
import { parseStringDate } from '../common/utils/date.utils';
import { ScrapperCurrencyAdapter, StooqCurrencyAdapter } from './utils/currency.adapter';
import { CurrencyType } from 'src/currencies/schema/currencyRate.schema';

type TickerType = {
  name: string;
  price: number;
  currency: string;
  date: Date;
};

@Injectable()
export class TickersScrapper {
  private readonly _currencyAdapter: ScrapperCurrencyAdapter = StooqCurrencyAdapter;
  private readonly _logger = new Logger(TickersScrapper.name);
  private readonly _baseUrl = 'https://stooq.pl/q/?s=';
  private _cookies = null;

  public get cookies() {
    return this._cookies;
  }
  public set cookies(value) {
    this._cookies = value;
  }

  async getTickerData(ticker: string): Promise<TickerType> {
    this._logger.debug('started full ticker scrapping');

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(this._baseUrl + ticker);

    const element = await page.waitForSelector('button.fc-cta-consent');
    await element.click();

    try {
      const validPagePromise = getByText(page, 'Kurs');
      const invalidPagePromise = getByText(page, 'Czy chodziło Ci o');

      const result = await Promise.race([validPagePromise, invalidPagePromise]);

      const textContent = await getText(result);

      if (textContent.includes('Kurs')) {
        const result = await this.scrap(page, ticker, true);
        await browser.close();
        return result;
      } else {
        const aElements = await result.$$eval('a', (elements) => elements.map((element) => element.href));

        await page.goto(aElements[0]);

        return await this.scrap(page, ticker, false);
      }
    } catch (error) {
      this._logger.debug('invalid ticker: ' + error);
      return null;
    } finally {
      await browser.close();
    }
  }

  private async scrap(page: Page, ticker: string, validTicker: boolean) {
    const priceTd = await getByIdAndText(page, 'f13', 'Kurs', 'td');

    const tekst = await getText(priceTd);

    const priceSpan = await getById(priceTd, 'aq_' + ticker);
    const price = await getText(priceSpan);

    const stockMarket = await getById(page, 'ta_s');

    const stockMarketText = await stockMarket.$eval('a', (aElement) => {
      console.log('AELEMENT', aElement);
      return aElement.textContent;
    });

    let currency = '$';
    try {
      const a = await priceTd.waitForSelector('a', { timeout: 2000 });
      currency = await getText(a);
    } catch (error) {
      this._logger.error('no price available for asset ' + ticker);
    }

    const dateTd = await getByText(page, 'Data', 'td');

    const dateSpans = await dateTd.$$eval('span', (spans) =>
      spans
        .map((span) => span.textContent)
        .reverse()
        .join('_'),
    );

    let currencyData = this._currencyAdapter.find((item) => item.symbol === currency);
    if (!currencyData) currencyData = { currency: 'USD', symbol: '$', formatter: (item) => item };

    const returnedData = {
      name: validTicker ? ticker : (await page.url()).split('=').pop(),
      price: currencyData.formatter(Number(price)),
      currency: currencyData.currency,
      date: parseStringDate(dateSpans),
      stockMarket: stockMarketText,
    };

    this._logger.debug('returning data: ', returnedData);

    return returnedData;
  }

  async updateTickerData(
    ticker: string,
    tickerCurrency: CurrencyType,
  ): Promise<{
    newPrice: number;
    newDate: Date;
  }> {
    this._logger.debug('started partial ticker scrapping');
    const url = this._baseUrl + ticker;

    //////////////////////////

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    if (this.cookies) {
      setPageCookies(page, this.cookies);
      await page.goto(url);
    } else {
      await page.goto(url);

      const element = await page.waitForSelector('button.fc-cta-consent');
      await element.click();
      page.cookies().then((cookies) => (this.cookies = cookies));
    }

    try {
      return await scrap.call(this, page);
    } catch (error) {
      this._logger.debug('error while scrapping: ' + error);
      return null;
    } finally {
      await browser.close();
    }

    async function scrap(page: Page) {
      const priceTd = await getByIdAndText(page, 'f13', 'Kurs', 'td');
      const priceSpan = await getById(priceTd, 'aq_' + ticker);
      const price = await getText(priceSpan);

      const dateTd = await getByText(page, 'Data', 'td');
      const dateSpans = await dateTd.$$eval('span', (spans) =>
        spans
          .map((span) => span.textContent)
          .reverse()
          .join('_'),
      );

      browser.close();

      let currencyData = this._currencyAdapter.find((item) => item.symbol === tickerCurrency);
      if (!currencyData) currencyData = { currency: 'USD', symbol: '$', formatter: (item) => item };

      const returnedData = {
        newPrice: currencyData.formatter(Number(price)),
        newDate: parseStringDate(dateSpans),
      };

      this._logger.debug('returning scrapped data: ', returnedData);

      return returnedData;
    }
  }
}
