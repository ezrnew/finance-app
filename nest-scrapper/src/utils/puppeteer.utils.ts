import { ElementHandle, Page } from 'puppeteer';

type elementHandleType = ElementHandle<Element>;
type handleOrPageType = ElementHandle<Element> | Page;

export const getByText = async (element: handleOrPageType, text: string, cssElement?: string) =>
  element.waitForSelector(cssElement ? `${cssElement} ::-p-text(${text})` : `::-p-text(${text})`);

export const getByIdAndText = async (element: handleOrPageType,id:string, text: string, cssElement?: string) =>
  element.waitForSelector(cssElement ? `${cssElement}#${id}::-p-text("${text}")` : `#${id}::-p-text("${text}")`);

//   export const getByTextExact = async (element:handleOrPageType, text:string, cssElement?:string) => {
//     const selector = cssElement ? `${cssElement} ::-p-text(${text})` : `::-p-text(${text})`;

//     console.log("TEXT",text)
//     const elementIndex = await element.$$eval(selector,(items,text)=>{  let xd =items.map(option => option.childNodes  );
      
//       console.log("tekscik",text);

//       let arr = [[]]
//       let foundIndex
//       xd.forEach((nodeList,index) => {
//         arr[index] = []
 
//         nodeList.forEach(node => {
// // @ts-ignore
// if(node.innerText || node.textContent ===text)  foundIndex=node

// // @ts-ignore
//           if(node.innerText)  arr[index].push(node.innerText)
//           else if(node.textContent)  arr[index].push(node.textContent)//<text>
//         });
        
//       });
//       return foundIndex
//     },text);
//     // const elements = await element.(selector)
//     console.log("elements index",elementIndex)
//     return elementIndex


//   };

export const getById = (element: handleOrPageType, id: string) => element.waitForSelector(`[id^="${id}"]`);

export const getText = async (element: elementHandleType) => await element.evaluate((el) => el.textContent);

// export const getAllElements = async(element: elementHandleType,cssElement:string) => await  element.$$eval('a', (elements) => elements.map((element) => element.href))

export const setPageCookies = async (page: Page, cookies: any[]) => {
  if (cookies) {
    for (let i = 0; i < cookies.length; i++) {
      await page.setCookie(cookies[i]);
    }
  }
};

