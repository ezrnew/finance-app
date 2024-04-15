import { Injectable, Logger } from '@nestjs/common';
import puppeteer, { Page } from 'puppeteer';
import { getById, getByText, getText, setPageCookies } from '../utils/puppeteer.utils';
import { parseStringDate } from '../utils/date.utils';

//todo
//1.get all data on initial scrap (stock)
//1.get all data on initial scrap (stock)
@Injectable()
export class TickersScrapper {
  private readonly _logger = new Logger(TickersScrapper.name);
  private readonly _baseUrl = 'https://stooq.pl/q/?s=';
  private _cookies = null;

  public get cookies() {
    return this._cookies;
  }
  public set cookies(value) {
    // console.log('ustawiam ciastko');
    this._cookies = value;
  }

  //todo first run all data, next runs only price & date
  async getTickerData(ticker: string) {
    this._logger.debug('started full ticker scrapping');
    //////////////////////////

    const browser = await puppeteer.launch({ headless: false });
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
        return await scrap.call(this, page, true);
      } else {
        const aElements = await result.$$eval('a', (elements) => elements.map((element) => element.href));

        await page.goto(aElements[0]);

        return await scrap.call(this, page, false);
      }
    } catch (error) {
      this._logger.debug('invalid ticker: ' + error);
      return null;
    } finally {
      await browser.close();
    }

    async function scrap(page: Page, validTicker: boolean) {
      const priceTd = await getByText(page, 'Kurs', 'td');
      const priceSpan = await getById(priceTd, 'aq_' + ticker);
      const price = await getText(priceSpan);

      const a = await priceTd.waitForSelector('a');
      const currency = await getText(a);

      const dateTd = await getByText(page, 'Data', 'td');

      const dateSpans = await dateTd.$$eval('span', (spans) =>
        spans
          .map((span) => span.textContent)
          .reverse()
          .join('_'),
      );

      browser.close();

      console.log('NOWADATA:', parseStringDate(dateSpans));
      console.log("zwracam dane")
      //todo
      const returnedData = {
        name: validTicker ? ticker : 'ZLYTICKERKOLEZKO',
        price,
        currency,
        date: parseStringDate(dateSpans),
      };

      this._logger.debug('returning data: ', returnedData);

      return returnedData;
    }
  }

  async updateTickerData(ticker: string) {
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
      const priceTd = await getByText(page, 'Kurs', 'td');
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

      const returnedData = {
        newPrice: Number(price),
        newDate: parseStringDate(dateSpans),
      };

      this._logger.debug('returning scrapped data: ', returnedData);

      return returnedData;
    }
  }
}
