import { ObjectId } from "mongoose";

export class BuyAssetDto {

    portfolioId:string;  
    category:string;
    account:string;

    asset:{name:string,type:string}
    date:Date
    currency:string
    currencyRate:number
    price:number
    quantity:number
    paymentAdded:boolean
    

  }