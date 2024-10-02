import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  getMonthShortNameByNumber,
  getPolishMonthNameByNumber,
  monthNumber,
} from '../../common/utils/date.utils';
import { CpiScrapper } from './cpi.scrapper';
import { yearlyCpiDto } from './dto/add-cpi.dto';
import { CpiPolishYY } from './schemas/cpi-polish-yy.schema';

//todo rename cpi model to polish cpi y/y
@Injectable()
export class CPIService {
  private readonly cpiScrapper = new CpiScrapper();

  constructor(@InjectModel(CpiPolishYY.name) private cpiModel: Model<CpiPolishYY>) {}

  async updateCPI_Polish(): Promise<void> {
    const currentDate = new Date();
    const month = currentDate.getMonth() as monthNumber; // -1 by default
    const monthName = getPolishMonthNameByNumber(month);
    const year = currentDate.getFullYear();

    const value = await this.cpiScrapper.getCPI_Polish(monthName, year);

    const result = await this.cpiModel.findOne({ year });

    const monthShortName = getMonthShortNameByNumber(month);
    if (result) {
      result[monthShortName] = value;

      result.save();
    } else {
      const newYear: yearlyCpiDto = {
        year,
        jan: null,
        feb: null,
        mar: null,
        apr: null,
        may: null,
        jun: null,
        jul: null,
        aug: null,
        sep: null,
        oct: null,
        nov: null,
        dec: null,
      };
      newYear[monthShortName] = value;

      const newYearData = new this.cpiModel(newYear);

      newYearData.save();
    }
  }

  // todo take country as arg if there are more cpis than polish
  async getCpiSinceDate() {}
}
