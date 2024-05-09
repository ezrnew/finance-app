import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { createTickerDto } from './dto/create-ticker.dto';
import { Ticker } from './schemas/ticker.schema';
import { TickersScrapper } from './tickers.scrapper';
import { isToday } from '../utils/date.utils';
import { removeMongoProperties } from '../utils/mongoose.utils';

@Injectable()
export class TickersService {
  private readonly _logger = new Logger(TickersService.name);
  private readonly tickerScrapper = new TickersScrapper();

  constructor(@InjectModel(Ticker.name) private tickerModel: Model<Ticker>) {}

  // async create(newTicker: createTickerDto): Promise<Ticker> {
  //   const createdTicker = new this.tickerModel(newTicker);
  //   return createdTicker.save();
  // }

  async addNew(name: string) {

    let ticker = await this.tickerModel.findOne({ name });
    if(ticker) return {new:false,data:ticker}
    console.log("tiker",ticker)
    this._logger.debug('no ticker found; scrapping...')

    const scrappedTicker = await this.tickerScrapper.getTickerData(name)

     ticker = await this.tickerModel.findOne({name: scrappedTicker.name });

     if(ticker){
      ticker.price = scrappedTicker.price
      ticker.date = scrappedTicker.date

      await ticker.save()
      return {new:false,data:ticker}
     }

//todo validate if ticker is correct
    try {
    const createdTicker = new this.tickerModel(scrappedTicker)
    
    
    return {new:true,data:createdTicker.save()}

    } catch (error) {
      this._logger.error("error saving new ticker:",error)
    }




  }


  async getOne(name: string) {
    let ticker = await this.tickerModel.findOne({ name });

    console.log("TINKER",ticker)

    if (!ticker) {
      throw new NotFoundException()
    // this._logger.debug('no ticker found; scrapping...')
    // const scrappedTicker = await this.tickerScrapper.getTickerData(name)
    // console.log("ZESKRAPOWANY",scrappedTicker)
    //  ticker = new this.tickerModel(scrappedTicker)
    // console.log("Model",ticker)
    // await ticker.save()



  } 
  
console.log("TICKEEEEEER",ticker)
// @ts-ignore
  const dateString = ticker.updatedAt;
  const dateObject = new Date(dateString);
  const differenceInHours = (Math.abs(Date.now() - dateObject.getTime())) / (1000 * 60 * 60);

  // console.log("dif in hours",differenceInHours)

  
   if (differenceInHours>24) {

     this._logger.debug('ticker found with obsolete data; scrapping...')
     const scrappedTicker = await this.tickerScrapper.updateTickerData(name)
     
     
     ticker.price=scrappedTicker.newPrice
     ticker.date=scrappedTicker.newDate
     await ticker.save()
     
     removeMongoProperties(ticker)
    }
  

  
  // const newTicker = {name:ticker.name,price:ticker.price,currency:ticker.currency,date:ticker.date}
  // delete ticker['__v']
  // delete ticker['_id']

    this._logger.debug('returning ticker:',ticker)
    return ticker;
  }

  async findAll(): Promise<Ticker[]> {
    return this.tickerModel.find().exec();
  }


// async getCiastka(){
//   console.log("ZWRACAM CIASTKA",this.tickerScrapper.cookies)
//   return this.tickerScrapper.cookies
// }

}
