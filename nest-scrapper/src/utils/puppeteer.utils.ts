import { ElementHandle, Page } from 'puppeteer';

type elementHandleType = ElementHandle<Element>;
type handleOrPageType = ElementHandle<Element> | Page;

export const getByText = async (element: handleOrPageType, text: string, cssElement?: string) =>
  element.waitForSelector(cssElement ? `${cssElement} ::-p-text(${text})` : `::-p-text(${text})`);

export const getByIdAndText = async (
  element: handleOrPageType,
  id: string,
  text: string,
  cssElement?: string,
) =>
  element.waitForSelector(
    cssElement ? `${cssElement}#${id}::-p-text("${text}")` : `#${id}::-p-text("${text}")`,
  );

export const getById = (element: handleOrPageType, id: string) => element.waitForSelector(`[id^="${id}"]`);

export const getText = async (element: elementHandleType) => await element.evaluate((el) => el.textContent);

export const setPageCookies = async (page: Page, cookies: any[]) => {
  if (cookies) {
    for (let i = 0; i < cookies.length; i++) {
      await page.setCookie(cookies[i]);
    }
  }
};
