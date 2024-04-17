import { Injectable } from '@nestjs/common';
import puppeteer, { ElementHandle, Page, Puppeteer } from 'puppeteer';
import { getText } from '../utils/puppeteer.utils';

@Injectable()
export class PLtrScrapper {
  async getData(currentText: string) {
    const url = 'https://www.obligacjeskarbowe.pl/komunikaty/';
    const newEmissionText = 'rozpoczyna się sprzedaż nowych emisji';

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(url);

    //   const article = await page.evaluate(() => {
    //     return document.querySelector('div.news__item');
    // });
    const huj = await page.waitForSelector('div.news__item');

    const newsItems = await page.$$('div.news__item');
    const articleElement = newsItems[1];

    const titleElement = await articleElement.waitForSelector('h3');
    const text = await getText(titleElement);

    console.log('article', text);

    //todo jak w ten zajebany link kliknac poza viewportem
    const huj2 = await page.waitForSelector('a.cookie__accept');
    await huj2.click();

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
              returnedData.push({ firstValue: firstValue, percentage: cleanedPercentages });
            }
          }
        }
      });
      return returnedData;
    });

    console.log(aLinksInLiItems);

    // const oligacjexd = ['ROR', 'DOR', 'OTS', 'TOS', 'COI', 'EDO', 'ROS', 'ROD'];

    // const nowyText = await getText(liItem);
    // console.log("LIPLS",aLinksInLiItems)

    // liItems.forEach(item =>{
    //   i
    // })
    // if(currentText === text){
    //   //no new data
    //   console.log("NIE MA NOWYCH")
    //   return false
    // }
    const returnedData = [];

    // if (!text.includes(newEmissionText)){
    //   //new article but no new emission
    //   return {text, data:undefined}
    // }

    // try{
    //   await this.evaluate(page, articleElement);

    //   // console.log('EWALUUJE')
    //   // await page.evaluate(async (page, articleElement) => {
    //   //   const firstLink = articleElement.querySelector('a');
    //   //   if (firstLink) {
    //   //     console.log("Clicking...");
    //   //     firstLink.click();
    //   //     console.log("Clicked...");

    //   //     const liItem = await page.waitForSelector('li');
    //   //     const nowyText = await getText(liItem);

    //   //     console.log("li item", nowyText);
    //   //   } else {
    //   //     console.log('No <a> element found within the first news item.');
    //   //   }
    //   // }, page, articleElement);
    // } catch (error) {
    //   console.error('Error:', error);
    // } finally {
    //   await browser.close();
    // }
  }

  // const link = await articleElement.waitForSelector('.link')
  // // await link.click()
  // await page.click('.link--right');

  // const liItem = await articleElement.waitForSelector('li')
  // const nowyText = await getText(liItem)

  // console.log("li item",nowyText)

  private async evaluate(page: Page, articleElementHandle: ElementHandle) {
    const firstLink = await articleElementHandle.$('a');
    if (firstLink) {
      console.log('Clicking...');
      await firstLink.click();
      console.log('Clicked...');

      const liItem = await page.waitForSelector('li');
      const nowyText = await getText(liItem);
      console.log('li item', nowyText);
    } else {
      console.log('No <a> element found within the first news item.');
    }
  }
}
