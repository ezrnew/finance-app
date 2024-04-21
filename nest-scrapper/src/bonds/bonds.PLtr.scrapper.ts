import { Injectable } from '@nestjs/common';
import puppeteer, { ElementHandle, Page, Puppeteer } from 'puppeteer';
import { getText } from '../utils/puppeteer.utils';

//todo cleanup
@Injectable()
export class PLtrScrapper {
  async getData(currentText: string) {
    const url = 'https://www.obligacjeskarbowe.pl/komunikaty/';
    const newEmissionText = 'rozpoczyna się sprzedaż nowych emisji';

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(url);

    const newsItems = await page.$$('div.news__item');
    const articleElement = newsItems[1];

    const titleElement = await articleElement.waitForSelector('h3');
    const text = await getText(titleElement);

    if (currentText === text) {
      //no new data
      await browser.close();
      return false;
    }

    if (!text.includes(newEmissionText)) {
      //new article but no new emission
      await browser.close();
      return { text };
    }

    //todo jak w ten zajebany link kliknac poza viewportem
    const cookieButton = await page.waitForSelector('a.cookie__accept');
    await cookieButton.click();

    const element = await articleElement.waitForSelector('a.link');
    await element.click();

    const articleContent = await page.waitForSelector('.article-box__content');
    const aLinksInLiItems = await articleContent.$$eval('li', (lis) => {
      const returnedData = [];
      lis.forEach((li) => {
        const aElement = li.querySelector('a');
        if (aElement) {
          const text = li.textContent || '';
          const symbolMatch = text.match(/\(([^)]+)\)/);
          const percentageMatches = text.match(/(?:\b|[^,\s%]+)(.{10}\d+(?:\.\d+)?%)/g);
          if (symbolMatch && percentageMatches) {
            const firstValue = symbolMatch[1];
            const cleanedPercentages = percentageMatches.map((match) => {
              const cleanedMatch = match.replace(/[, ]/g, '').match(/\d+(?:\.\d+)?/)[0];
              return parseFloat(cleanedMatch) / 100;
            });
            const foundIndex = returnedData.findIndex((item) => item.firstValue === firstValue);
            if (foundIndex !== -1) {
              returnedData[foundIndex].percentage.push(...cleanedPercentages);
            } else {
              returnedData.push({ symbol: firstValue, percentage: cleanedPercentages });
            }
          }
        }
      });
      return returnedData;
    });

    await browser.close();
    return { text, data: aLinksInLiItems };
  }
}
