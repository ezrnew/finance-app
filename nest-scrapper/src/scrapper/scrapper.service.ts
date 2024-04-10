import { Injectable, Logger } from '@nestjs/common';
import puppeteer, { Page } from 'puppeteer';
import { getById, getByText, getText } from '../utils/puppeteer.utils';

@Injectable()
export class ScrapperService {
  private readonly _logger = new Logger(ScrapperService.name);
  private readonly _baseUrl = 'https://stooq.pl/q/?s=';

  async getByTicker(ticker: string) {
    this._logger.debug('startedxd');

    const scrap = async (page: Page) => {
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

      const returnedData = { price, currency, date: dateSpans };

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
        return await scrap(page);
      } else {
        const aElements = await result.$$eval('a', (elements) => elements.map((element) => element.href));

        await page.goto(aElements[0]);

        return await scrap(page);
      }
    } catch (error) {
      this._logger.debug('invalid ticker: ' + error);
      return null;
    } finally {
      await browser.close();
    }
  }
}
