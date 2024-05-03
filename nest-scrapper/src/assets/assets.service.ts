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

  async findAll(): Promise<{bonds_pltr:string[],tickers:string[]}> {

    const bonds = await this.edoModel.distinct('id');
    const tickers = await this.tickerModel.distinct('name')

    const data ={bonds_pltr:bonds,tickers}

    return data
  }
}
