import { Injectable, Logger } from '@nestjs/common';
import puppeteer, { Page } from 'puppeteer';
import { getById, getByText, getText } from '../utils/puppeteer.utils';
import { parseStringDate } from '../utils/date.utils';

@Injectable()
export class TickersScrapper {
  private readonly _logger = new Logger(TickersScrapper.name);
  private readonly _baseUrl = 'https://stooq.pl/q/?s=';

  //todo first run all data, next runs only price & date
  async getTickerData(ticker: string) {

    this._logger.debug('started full ticker scrapping');

    const scrap = async (page: Page, validTicker: boolean) => {
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

      await browser.close();

      console.log('NOWADATA:', parseStringDate(dateSpans));
//todo
      const returnedData = {
        name: validTicker ? ticker : 'ZLYTICKERKOLEZKO',
        price,
        currency,
        date: parseStringDate(dateSpans),
      };

      this._logger.debug('returning data: ' + returnedData);

      return returnedData;
    };

    //////////////////////////

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
        return await scrap(page, true);
      } else {
        const aElements = await result.$$eval('a', (elements) => elements.map((element) => element.href));

        await page.goto(aElements[0]);

        return await scrap(page, false);
      }
    } catch (error) {
      this._logger.debug('invalid ticker: ' + error);
      return null;
    } finally {
      await browser.close();
    }
  

  }

  //todo should this func exclude czy chodziło ci o?
  async updateTickerData(ticker: string) {
    this._logger.debug('started partial ticker scrapping');

    const scrap = async (page: Page, validTicker: boolean) => {
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

      await browser.close();

      console.log('NOWADATA:', parseStringDate(dateSpans));
//todo
      const returnedData = {
        // name: validTicker ? ticker : 'ZLYTICKERKOLEZKO',
        newPrice:Number(price),
        // currency,
        newDate: parseStringDate(dateSpans),
      };

      this._logger.debug('returning data: ' + returnedData);

      return returnedData;
    };

    //////////////////////////

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
        return await scrap(page, true);
      } else {
        const aElements = await result.$$eval('a', (elements) => elements.map((element) => element.href));

        await page.goto(aElements[0]);

        return await scrap(page, false);
      }
    } catch (error) {
      this._logger.debug('invalid ticker: ' + error);
      return null;
    } finally {
      await browser.close();
    }
  }
}
