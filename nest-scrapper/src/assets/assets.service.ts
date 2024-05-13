import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Edo } from '../bonds/schemas/bonds.polishTreasury';
import { Ticker } from '../tickers/schemas/ticker.schema';

@Injectable()
export class AssetsService {
  constructor(
    @InjectModel(Ticker.name) private tickerModel: Model<Ticker>,
    @InjectModel(Edo.name) private edoModel: Model<Edo>, //todo merge all pl bonds
  ) {}

  async findAll(): Promise<any[]> {
    const pltr_bonds = await this.edoModel.distinct('id');
    const tickers = await this.tickerModel.aggregate([
      
        {"$group": { "_id": { name: "$name", price: "$price", currency: "$currency" } } }
    ])

    console.log("FIND ALL ASSETS TICKERS",tickers)

    const assets = [];
    pltr_bonds.forEach((bondString) => assets.push({ name: bondString, type: 'bond_pltr',currency:"PLN",price:100 }));
    //todo refactor query so it doesnt look like shit
    tickers.forEach((item) => assets.push({ name: item._id.name, type: 'tickers',currency:item._id.currency,price:item._id.price }));

    return assets;
  }
}
