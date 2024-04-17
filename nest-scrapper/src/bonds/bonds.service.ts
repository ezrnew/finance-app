import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PLtrArticle } from './schemas/bonds.polishTreasuryArticle';
import { Model } from 'mongoose';
import { PLtrScrapper } from './bonds.PLtr.scrapper';

@Injectable()
export class BondsService {
  constructor(
    @InjectModel(PLtrArticle.name) private polishTreasuryArticle: Model<PLtrArticle>,
    private readonly polishTreasuryScrapper: PLtrScrapper,
  ) {}

  async updatePLtr() {

    console.log("UPDATE PLTR")


    const data = await this.polishTreasuryScrapper.getData("123")

    console.log("data nonie",data)
  }
}
