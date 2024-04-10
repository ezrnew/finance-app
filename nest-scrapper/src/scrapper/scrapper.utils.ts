// import { ElementHandle, Page } from 'puppeteer';

// type elementHandleType = ElementHandle<Element> ;
// type handleOrPageType = ElementHandle<Element> | Page ;

// export const getByText = async (element: handleOrPageType, text: string, cssElement?: string) =>
//   element.waitForSelector(cssElement ? `${cssElement} ::-p-text(${text})` : `::-p-text(${text})`);

// export const getById = (element: handleOrPageType, id: string) => element.waitForSelector(`[id^="${id}"]`);

// export const getText = async(element: elementHandleType) => await element.evaluate((el) => el.textContent)

// // export const getAllElements = async(element: elementHandleType,cssElement:string) => await  element.$$eval('a', (elements) => elements.map((element) => element.href))