import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { CPIService } from '../general/cpi/cpi.service';
import {
  getMonthNumberBefore,
  getMonthShortNameByNumber,
  monthNumber,
  isDifferenceLessThanAYear,
  isDateBeforeOtherDateIgnoringYear,
  differenceInDays,
} from '../utils/date.utils';
import { Model } from 'mongoose';
import { Cpi } from '../general/cpi/schemas/cpi.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Coi, Edo, Ots, Rod, Ros, Tos } from './schemas/bonds.polishTreasury';
import {
  addPercentageRate,
  calculateConstantRate,
  calculateCummulatedRate,
  calculateYearRateByDaysPassed,
} from '../utils/math.utils';
import { BondFactory, CoiFactory, EdoFactory } from './polishTreasury.factory';

//stalokuponowe
//oprocentowane stopa refer
//indeksowane inflacja
@Injectable()
export class PolishTreasury {
  //   constructor(private readonly cpiService: CPIService) {}
  constructor(
    @InjectModel(Cpi.name) private cpiModel: Model<Cpi>,
    private readonly bondFactoryCreator: BondFactory,
    // private readonly coiFactory: CoiFactory,
    // // @InjectModel(Edo.name) private edoModel: Model<Edo>,
    // // @InjectModel(Coi.name) private coiModel: Model<Coi>,
  ) {}

  private readonly logger = new Logger(PolishTreasury.name);
  // private readonly bondTypes = {
  //   fixed: [
  //     { id: 'OTS', length: 3 }, //todo hardcode this in months in handler
  //     { id: 'TOS', length: 3 },
  //   ],
  //   reference: [
  //     { id: 'ROR', length: 1 },
  //     { id: 'DOR', length: 2 },
  //   ],
  //   cpi: [
  //     { id: 'COI', length: 4 },
  //     { id: 'ROS', length: 6 },
  //     { id: 'EDO', length: 10 },
  //     { id: 'ROD', length: 12 },
  //   ],
  // } as const;

  async handleBond(bondString: string, day?: number, hasIke?: boolean) {
    //todo validate dayOfMonth
    const dayOfMonth = day || 1;
    const ike = hasIke || false;
    // console.log('dobry dzien', dayOfMonth);

    const result = this.validateBond(bondString);
    if (!result) return false;

    const { type, month, year } = result;
    console.log('RESULT', type, month, year);

    const bondFactory = this.bondFactoryCreator.getBondFactory(type);

    // const { kind, lengthInYears } = this.getBondData(type);
    const globalType = bondFactory.getGlobalType();

    if (globalType === 'cpi') {
      return await this.calculateCpiIndexed(
        type,
        bondString,
        bondFactory.getLengthInMonths() / 12,
        bondFactory.getModel() as Model<Edo | Coi | Rod | Ros>,
        dayOfMonth,
        month,
        year,
      );
    }

    if (globalType === 'reference') {
      //todo implement
      return 2137;
    }
    if (globalType === 'fixed') {
      return await this.calculateFixed(
        type,
        bondString,
        bondFactory.getLengthInMonths(),
        bondFactory.getModel() as Model<Ots | Tos>,
        dayOfMonth,
        month,
        year,
      );
    }
  }

  private async calculateFixed(
    type: string,
    bondString: string,
    lengthInMonths: number,
    dbModel: Model<Ots | Tos>,
    dayOfMonth: number,
    month: number,
    endYear: number,
  ) {
    const currentDate = new Date();
    const endDate = new Date(endYear + 2000, month - 1, dayOfMonth);

    const bondData = await dbModel.findOne({ id: bondString.toUpperCase() });

    if (!bondData) {
      this.logger.warn('no data available for ' + bondString);
      return false;
    }

    const bondRate = bondData.rate;

    const daysToEnd = differenceInDays(endDate, currentDate);

    let rate = 100;

    if (daysToEnd <= 0) return rate + (rate * ((bondRate * lengthInMonths) / 12)) / 100;

    const startDate = new Date(endDate);
    startDate.setMonth(endDate.getMonth() - lengthInMonths);

    const daysSinceStart = differenceInDays(currentDate, startDate);

    const daysPercentage = daysSinceStart / (daysSinceStart + daysToEnd);

    return rate + daysPercentage * ((bondRate * lengthInMonths) / 12);
  }

  private async calculateCpiIndexed(
    type: string,
    bondString: string,
    lengthInYears: number,
    dbModel: Model<Edo | Coi | Ros | Rod>,
    dayOfMonth: number,
    month: number,
    endYear: number,
  ) {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const startDate = new Date(endYear + 2000 - lengthInYears, month - 1, dayOfMonth);
    const endDate = new Date(endYear + 2000, month - 1, dayOfMonth);

    //todo add validation before getRate function
    if (currentDate < startDate) {
      console.log('futura ');
      return false;
    }

    const cpiMonth = getMonthShortNameByNumber(getMonthNumberBefore(month, 2) as monthNumber);
    // const isJanOrFeb = cpiMonth === 'jan' || cpiMonth === 'feb' ? 2 : 1;

    let query: any = {};
    let endYearFull = endYear + 2000;
    if (endDate > currentDate) {
      let unfinishedYear = endYearFull - 1 - lengthInYears;

      //czy
      if (isDateBeforeOtherDateIgnoringYear(currentDate, startDate)) {
        console.log('date older', currentDate.toLocaleDateString(), startDate.toLocaleDateString());
        unfinishedYear = unfinishedYear + 1;
      }

      console.log('nieskonczona, rok', unfinishedYear);

      query.year = { $gt: unfinishedYear };
    } else {
      query.year = { $gte: endYearFull + 1 - lengthInYears, $lt: endYearFull };
    }

    /* EDO VALUES */
    const bondData = await dbModel.findOne({ id: bondString.toUpperCase() });

    if (!bondData) {
      this.logger.warn('no data available for ' + bondString);
      return false;
    }
    const { firstYear, margin } = bondData;
    console.log('BOND VALS', firstYear, margin);
    /* EDO VALUES */

    const cpiArrayQuery = await this.cpiModel.find(query);
    console.log('CPIPLS', cpiArrayQuery);
    const cpiArrayUnfiltered = [];
    cpiArrayQuery.forEach((item) => {
      cpiArrayUnfiltered.push(item[cpiMonth]);
    });

    const cpiArray = cpiArrayUnfiltered.filter((n) => n);

    console.log('CPI ARRAY', cpiArray);

    if (cpiArray.length === 0) {
      //NO DATA FOR CPI,RETURN CURRENT NON-FULL YEAR
      // console.log("returning single year")
      return calculateYearRateByDaysPassed(
        100,
        firstYear,
        new Date(endYear + 2000 - lengthInYears, month - 1, dayOfMonth),
      );
    }

    // const lastCpi = {
    //   year: cpiArrayQuery[cpiArrayQuery.length - n].year,
    //   month: cpiArrayQuery[cpiArrayQuery.length - n][cpiMonth],
    // };
    // console.log('OSTATNI WYNIK CPI', lastCpi);

    let cpiPlusMargin = cpiArray.map((item) => (item < 0 ? 0 + margin : item + margin));

    cpiPlusMargin =
      (cpiMonth === 'jan' || cpiMonth === 'feb') && endDate > currentDate
        ? cpiPlusMargin.slice(1)
        : cpiPlusMargin;

    //PREPARE DATA
    console.log('curr month i monthliczony', currentMonth, month - 2);

    let lastRate;
    //zarówno w przypadku jak znana jak i nieznana popuje bo muszę wyliczyć niecały rok za ostatnią
    if (endDate > currentDate /* && lastCpi.month!=null*/) {
      console.log('jezeli rok wiekszy');
      lastRate = cpiPlusMargin.pop();
      // console.log("popek",popek)
    }

    console.log('CPI PLUS MARG after eventual pop()', cpiPlusMargin);

    //CALCULATE

    let years = lengthInYears;

    let returnRate = 100;

    if (isDifferenceLessThanAYear(startDate, currentDate)) {
      console.log('obl krótsza niżrok');
      return calculateYearRateByDaysPassed(
        returnRate,
        firstYear,
        new Date(endYear + 2000 - years, month - 1, dayOfMonth),
      );
    }

    console.log('lastRate', lastRate);

    returnRate = addPercentageRate(returnRate, firstYear);
    years = years - 1;
    console.log('after first year:', returnRate);

    console.log('cummulated rate:', returnRate, cpiPlusMargin.length, cpiPlusMargin);

    //?
    if (cpiPlusMargin.length > 0) {
      //todo
      if (type === 'COI') {
        returnRate = calculateConstantRate(returnRate, cpiPlusMargin);
      } else {
        returnRate = calculateCummulatedRate(returnRate, cpiPlusMargin.length, cpiPlusMargin);
      }

      years = years - cpiPlusMargin.length;
    }

    if (endDate > currentDate) {
      returnRate = calculateYearRateByDaysPassed(
        returnRate,
        lastRate,
        new Date(endYear + 2000 - years, month - 1, dayOfMonth),
      );
    }

    console.log('pozostalo lat:', years);

    console.log('return rate:', returnRate);

    return 3;
  }

  private validateBond(bondString: string) {
    if (bondString.length != 7) {
      console.log('invalid length');
      return false;
    }

    //todo extract to factory
    const availableTypes = ['ROR', 'DOR', 'OTS', 'TOS', 'COI', 'EDO', 'ROS', 'ROD'];

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
      console.log('invalid type', month, year);
      return false;
    }

    return { type, month, year };
  }

  // private getBondData(type: string) {
  //   let bondData: { id: string; length: number };
  //   let bondRate: 'fixed' | 'reference' | 'cpi';

  //   for (const key in this.bondTypes) {
  //     if (Object.prototype.hasOwnProperty.call(this.bondTypes, key)) {
  //       const array = this.bondTypes[key];
  //       bondData = array.find((item) => item.id === type);
  //       if (bondData) {
  //         bondRate = key as typeof bondRate;
  //         break;
  //       }
  //     }
  //   }

  //   return { kind: bondRate, lengthInYears: bondData.length };
  // }
}
