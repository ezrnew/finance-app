import { Injectable } from "@nestjs/common"

export type ScrapperCurrencyAdapter=[
    {currency:"PLN",symbol:string,formatter:(val:number)=>number},
    {currency:"GBP",symbol:string,formatter:(val:number)=>number},
    {currency:"USD",symbol:string,formatter:(val:number)=>number},
    {currency:"EUR",symbol:string,formatter:(val:number)=>number}


]


export const StooqCurrencyAdapter:ScrapperCurrencyAdapter=[
    
{currency:"PLN",symbol:'zł',formatter:(val:number)=>val},
{currency:"GBP",symbol:'£',formatter:(val:number)=>val},
// @ts-ignore //todo
{currency:"GBP",symbol:'p.',formatter:(val:number)=>val/100},
// @ts-ignore //todo
{currency:"USD",symbol:'$',formatter:(val:number)=>val},
{currency:"EUR",symbol:'€',formatter:(val:number)=>val},
    
]




