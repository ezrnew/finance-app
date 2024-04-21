import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PLtrArticle } from './schemas/bonds.polishTreasuryArticle';
import { Model } from 'mongoose';
import { PLtrScrapper } from './bonds.PLtr.scrapper';
import { Coi, Edo, Ots, Rod, Ros, Tos } from './schemas/bonds.polishTreasury';

@Injectable()
export class BondsService {
  constructor(
    @InjectModel(PLtrArticle.name) private polishTreasuryArticleModel: Model<PLtrArticle>,
    private readonly polishTreasuryScrapper: PLtrScrapper,
    @InjectModel(Edo.name) private edoModel: Model<Edo>,
    @InjectModel(Coi.name) private coiModel: Model<Coi>,
    @InjectModel(Ros.name) private rosModel: Model<Ros>,
    @InjectModel(Rod.name) private rodModel: Model<Rod>,
    @InjectModel(Ots.name) private otsModel: Model<Ots>,
    @InjectModel(Tos.name) private tosModel: Model<Tos>
  ) {}
  private readonly logger = new Logger(BondsService.name);

  async updatePLtr() {

    console.log("UPDATE PLTR")

    const articleText = (await this.polishTreasuryArticleModel.findOne()).text || ""
    const scrappedData = await this.polishTreasuryScrapper.getData(articleText)

    if(!scrappedData){
      this.logger.log("no new data availabe for PLtr")
      return
    }
   
      await this.polishTreasuryArticleModel.findOneAndUpdate({},{text:scrappedData.text},{ new: true, upsert: true })
     
      if(!scrappedData.data){
      this.logger.log("new article available but no new emission, updating article only")

      return
      }


      try {
        
      const edo = scrappedData.data.find(item => item.symbol.startsWith('EDO'));
      const coi = scrappedData.data.find(item => item.symbol.startsWith('COI'));
      const ros = scrappedData.data.find(item => item.symbol.startsWith('ROS'));
      const rod = scrappedData.data.find(item => item.symbol.startsWith('ROD'));
      const ots = scrappedData.data.find(item => item.symbol.startsWith('OTS'));
      const tos = scrappedData.data.find(item => item.symbol.startsWith('TOS'));

      await Promise.all([
         this.edoModel.findOneAndUpdate({id:edo.symbol},{id:edo.symbol,firstYear:edo.percentage[0],margin:edo.percentage[1]},{ new: true, upsert: true }),
         this.coiModel.findOneAndUpdate({id:coi.symbol},{id:coi.symbol,firstYear:coi.percentage[0],margin:coi.percentage[1]},{ new: true, upsert: true }),
         this.rosModel.findOneAndUpdate({id:ros.symbol},{id:ros.symbol,firstYear:ros.percentage[0],margin:ros.percentage[1]},{ new: true, upsert: true }),
         this.rodModel.findOneAndUpdate({id:rod.symbol},{id:rod.symbol,firstYear:rod.percentage[0],margin:rod.percentage[1]},{ new: true, upsert: true }),
         this.otsModel.findOneAndUpdate({id:ots.symbol},{id:ots.symbol,rate:ots.percentage[0]},{ new: true, upsert: true }),
         this.tosModel.findOneAndUpdate({id:tos.symbol},{id:tos.symbol,rate:tos.percentage[0]},{ new: true, upsert: true }),
      ])


    } 


      catch (error) {
        this.logger.error("cannot update PLtr:",error)
      }

  }

}
