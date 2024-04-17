import { Injectable } from '@nestjs/common';
import { getPolishMonthNameByNumber } from '../../utils/date.utils';
import puppeteer, { ElementHandle } from 'puppeteer';
import { getByText, getText } from '../../utils/puppeteer.utils';

@Injectable()
export class CpiScrapper {
  async getCPI_Polish(monthName: string, year: number) {
    const url = 'https://stat.gov.pl/wykres/1.html';

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(url);

    //todo fix finding by text
    const tdElement = await getByText(page, monthName, 'tr');
    const trElement = (await tdElement.getProperty('parentNode')) as ElementHandle<Element>;
    console.log('TEER', trElement);
    const tdElements = await trElement.$$('td');

    console.log('ITEMek', tdElements[tdElements.length - 1]);
    console.log('it tekst', await getText(tdElements[tdElements.length - 1]));

    const newValue = Number(await getText(tdElements[tdElements.length - 1]));
    await browser.close();
    return newValue;
  }
}
