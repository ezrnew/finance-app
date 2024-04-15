import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { CPIService } from '../general/cpi/cpi.service';
import { getMonthNumberBefore, getMonthShortNameByNumber, monthNumber } from '../utils/date.utils';
import { Model } from 'mongoose';
import { Cpi } from '../general/cpi/schemas/cpi.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PolishTreasury {
  //   constructor(private readonly cpiService: CPIService) {}
  constructor(@InjectModel(Cpi.name) private cpiModel: Model<Cpi>) {}

  private readonly logger = new Logger(PolishTreasury.name);

  async handleBond(bondString: string) {
    const result = this.validateBond(bondString);
    if (!result) return false;

    const { type, month, year } = result;
    console.log('RESULT', type, month, year);
    //todo type SOLID
    return await this.getEdoRate(month, year);
  }

  private async getEdoRate(month: number, endYear: number) {
    const edoYears=10

    const currentYear = new Date().getFullYear() - 2000;

    // let monthShortName = getMonthShortNameByNumber(month as monthNumber)
    const cpiMonth = getMonthShortNameByNumber(getMonthNumberBefore(month,2) as monthNumber)
    // console.log("CPI",cpiMonth)

    let query:any = {}
    let endYearFull = endYear+2000
    if (endYear > currentYear) {
      // If endYear is greater than currentYear, find all items where year is greater than (endYear - 10)
      query.year = { $gt: endYearFull+1 - 10 };
    } else {
      // If endYear is not greater than currentYear, find all items where year is >= (endYear - 10) and < endYear
      query.year = { $gte: endYearFull - 10, $lt: endYearFull };
    }


    const cpi = await this.cpiModel.find(query)

    console.log("CPIPLS",cpi)

    if(endYear>currentYear){
      console.log("jeszcze nie zapadla")



    }else{
      console.log("zapadla")
    }


    return 3


  }

  private validateBond(bondString: string) {
    if (bondString.length != 7) {
      console.log('invalid length');
      return false;
    }

    const availableTypes = ['ROR', 'DOR', 'TOS', 'COI', 'EDO', 'ROS', 'ROD'];

    const type = bondString.slice(0, 3).toUpperCase();
    const month = parseInt(bondString.slice(3, 5)); // "04"
    const year = parseInt(bondString.slice(5, 7)); // "34"

    if (
      !availableTypes.includes(type) ||
      isNaN(month) ||
      !(month >= 1 && month <= 12) ||
      isNaN(year) ||
      year < 20 //todo currently no support for older ones
    ) {
      console.log('invalid type',month,year);
      return false;
    }

    return { type, month, year };
  }

  private getFirstYear(num:number){

  }
}
