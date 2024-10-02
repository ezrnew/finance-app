import { Injectable } from '@nestjs/common';
import { CurrencyType } from './schema/currencyRate.schema';
import puppeteer from 'puppeteer';
import {
  getById,
  getByIdAndText,
  getByText,
  getText,
  setPageCookies,
} from '../../common/utils/puppeteer.utils';

@Injectable()
export class CurrenciesRateScrapper {
  private _baseUrl = 'https://stooq.pl/q/?s=';

  private _cookies = null;

  public get cookies() {
    return this._cookies;
  }
  public set cookies(value) {
    this._cookies = value;
  }

  async getCurrencyRate(from: CurrencyType, to: CurrencyType) {
    const url = this._baseUrl + from + to;
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

    const priceTd = await getByIdAndText(page, 'f13', 'Kurs', 'td');

    const priceElementText = await getText(priceTd);
    return priceElementText.replace(/^\D+|\D+$/g, '');
  }
}
