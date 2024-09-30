import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CpiPolishYY } from '../../general/cpi/schemas/cpi-polish-yy.schema';
import {
  differenceInDays,
  getDifferenceInYears,
  getMonthNumberBefore,
  getMonthShortNameByNumber,
  isDateBeforeOtherDateIgnoringYear,
  isDifferenceLessThanAYear,
  isValidDayOfMonth,
  monthNumber,
} from '../../common/utils/date.utils';
import {
  addPercentageRate,
  calculateConstantRate,
  calculateCummulatedRate,
  calculateYearRateByDaysPassed,
} from '../../common/utils/math.utils';
import { BondFactory } from './bonds-polish-treasury.factory';
import { Coi, Edo, Ots, Rod, Ros, Tos } from './schemas/bonds.polishTreasury';
import { Asset, AssetWithDay } from 'src/common/types/portfolioAsset.type';

//todo will originalCurrencyPrice work if portfolio currency is different than PLN?

@Injectable()
export class BondsPolishTreasuryService {
  constructor(
    @InjectModel(CpiPolishYY.name) private cpiModel: Model<CpiPolishYY>,
    private readonly bondFactoryCreator: BondFactory,
  ) {}

  private readonly logger = new Logger(BondsPolishTreasuryService.name);
  private readonly belkaTax = 0.19; //todo extract somewhere

  //todo refactor
  // async handleBond(bondString: string, day?: number, hasIke?: boolean) {
  //   const dayOfMonth = day || 1;
  //   const ike = hasIke || false;

  //   const result = this.validateBond(bondString);
  //   if (!result) return false;

  //   const { type, month, year } = result;

  //   const bondFactory = this.bondFactoryCreator.getBondFactory(type);

  //   if (!isValidDayOfMonth(year - Math.floor(bondFactory.getLengthInMonths() / 12), month, dayOfMonth))
  //     return false;

  //   switch (type) {
  //     case 'EDO': {
  //       return await this.calculateEDO([{ type, day }], ike);
  //     }
  //   }
  // }
  async updateBondsMany(bonds: AssetWithDay[], ike: boolean) {
    await this.calculateEDO(
      bonds.filter((bond) => bond.name.startsWith('EDO')),
      ike,
    );

    await this.calculateROD(
      bonds.filter((bond) => bond.name.startsWith('ROD')),
      ike,
    );
    await this.calculateROS(
      bonds.filter((bond) => bond.name.startsWith('ROS')),
      ike,
    );
    await this.calculateCOI(
      bonds.filter((bond) => bond.name.startsWith('COI')),
      ike,
    );
    await this.calculateOTS(
      bonds.filter((bond) => bond.name.startsWith('OTS')),
      ike,
    );
    await this.calculateTOS(
      bonds.filter((bond) => bond.name.startsWith('TOS')),
      ike,
    );
  }

  private async calculateEDO(bonds: AssetWithDay[], ike: boolean) {
    if (bonds.length === 0) return;
    const currentDate = new Date();

    const bondData = this.bondFactoryCreator.getBondFactory('EDO');
    const bondModel = bondData.getModel() as Model<Edo>;

    const bondTypes = [];
    bonds.forEach((bond) => bondTypes.push(bond.name));
    const bondCalculateValues = await bondModel.find({ id: { $in: bondTypes } });

    const { oldestCpiYear, newestCpiYear } = this.getYearDateRangeForCpi(
      bondTypes,
      bondData.getLengthInMonths() / 12,
    );

    const cpiData = await this.cpiModel.find({
      year: {
        $gte: oldestCpiYear,
        $lte: newestCpiYear,
      },
    });

    bonds.forEach((bond) => {
      let yearsLeft = bondData.getLengthInMonths() / 12;
      let returnRate = 100;

      const result = this.validateBond(bond.name);
      if (!result) return false;

      const { month, year } = result;
      let endYear = year + 2000;

      const startDate = new Date(endYear - bondData.getLengthInMonths() / 12, month - 1, bond.day);
      const endDate = new Date(endYear, month - 1, bond.day);

      const value = bondCalculateValues.find((item) => item.id === bond.name);

      if (!value) return false;

      let firstYearValue = value.firstYear;
      let marginValue = value.margin;

      const cpiMonth = getMonthShortNameByNumber(getMonthNumberBefore(month, 2) as monthNumber);
      let startYear = endYear - bondData.getLengthInMonths() / 12;

      if (month < 2) {
        startYear--, endYear--;
      }

      const cpiFiltered = cpiData.filter((item) => item.year > startYear && item.year < endYear);
      const cpiMonthly = [];

      cpiFiltered.forEach((item) => {
        cpiMonthly.push(item[cpiMonth]);
      });

      let cpiPlusMargin = cpiMonthly.map((item) => (item < 0 ? 0 + marginValue : item + marginValue));

      //calculate

      if (isDifferenceLessThanAYear(startDate, currentDate)) {
        returnRate = calculateYearRateByDaysPassed(
          returnRate,
          firstYearValue,
          new Date(endYear - bondData.getLengthInMonths() / 12, month - 1, bond.day),
        );
        return; //?
      }
      let lastRate;
      if (endDate > currentDate) {
        lastRate = cpiPlusMargin.pop();
      }
      //first year fixed value
      returnRate = addPercentageRate(returnRate, firstYearValue);
      yearsLeft = yearsLeft - 1;

      //remaining years
      if (cpiPlusMargin.length > 0) {
        returnRate = calculateCummulatedRate(returnRate, cpiPlusMargin.length, cpiPlusMargin);
        yearsLeft = yearsLeft - cpiPlusMargin.length;
      }

      //check for ike if finished, if not calculate last year separately
      if (endDate < currentDate) {
        if (!ike) {
          returnRate -= (returnRate - 100) * this.belkaTax;
        }
      } else {
        returnRate = calculateYearRateByDaysPassed(
          returnRate,
          lastRate,
          new Date(endYear - yearsLeft, month - 1, bond.day),
        );
      }

      bond.price = bond.buyPrice * (returnRate / 100);
      bond.originalCurrencyPrice = bond.originalCurrencyBuyPrice * (returnRate / 100);
    });

    // return newBonds;
  }

  private async calculateROD(bonds: AssetWithDay[], ike: boolean) {
    if (bonds.length === 0) return;

    const currentDate = new Date();

    const bondData = this.bondFactoryCreator.getBondFactory('ROD');
    const bondModel = bondData.getModel() as Model<Rod>;

    const bondTypes = [];
    bonds.forEach((bond) => bondTypes.push(bond.type));
    const bondCalculateValues = await bondModel.find({ id: { $in: bondTypes } });

    const { oldestCpiYear, newestCpiYear } = this.getYearDateRangeForCpi(
      bondTypes,
      bondData.getLengthInMonths() / 12,
    );

    const cpiData = await this.cpiModel.find({
      year: {
        $gte: oldestCpiYear,
        $lte: newestCpiYear,
      },
    });

    bonds.forEach((bond) => {
      let yearsLeft = bondData.getLengthInMonths() / 12;
      let returnRate = 100;

      const result = this.validateBond(bond.type);
      if (!result) return false;

      const { month, year } = result;
      let endYear = year + 2000;

      const startDate = new Date(endYear - bondData.getLengthInMonths() / 12, month - 1, bond.day);
      const endDate = new Date(endYear, month - 1, bond.day);

      const value = bondCalculateValues.find((item) => item.id === bond.type);

      if (!value) return false;

      let firstYearValue = value.firstYear;
      let marginValue = value.margin;

      const cpiMonth = getMonthShortNameByNumber(getMonthNumberBefore(month, 2) as monthNumber);
      let startYear = endYear - bondData.getLengthInMonths() / 12;

      if (month < 2) {
        startYear--, endYear--;
      }

      const cpiFiltered = cpiData.filter((item) => item.year > startYear && item.year < endYear);
      const cpiMonthly = [];

      cpiFiltered.forEach((item) => {
        cpiMonthly.push(item[cpiMonth]);
      });

      let cpiPlusMargin = cpiMonthly.map((item) => (item < 0 ? 0 + marginValue : item + marginValue));

      //calculate

      if (isDifferenceLessThanAYear(startDate, currentDate)) {
        returnRate = calculateYearRateByDaysPassed(
          returnRate,
          firstYearValue,
          new Date(endYear - bondData.getLengthInMonths() / 12, month - 1, bond.day),
        );
        return; //?
      }
      let lastRate;
      if (endDate > currentDate) {
        lastRate = cpiPlusMargin.pop();
      }
      //first year fixed value
      returnRate = addPercentageRate(returnRate, firstYearValue);
      yearsLeft = yearsLeft - 1;

      //remaining years
      if (cpiPlusMargin.length > 0) {
        returnRate = calculateCummulatedRate(returnRate, cpiPlusMargin.length, cpiPlusMargin);
        yearsLeft = yearsLeft - cpiPlusMargin.length;
      }

      //check for ike if finished, if not calculate last year separately
      if (endDate < currentDate) {
        if (!ike) {
          returnRate -= (returnRate - 100) * this.belkaTax;
        }
      } else {
        returnRate = calculateYearRateByDaysPassed(
          returnRate,
          lastRate,
          new Date(endYear - yearsLeft, month - 1, bond.day),
        );
      }

      bond.price = bond.buyPrice * (returnRate / 100);
      bond.originalCurrencyPrice = bond.originalCurrencyBuyPrice * (returnRate / 100);
    });
  }

  private async calculateROS(bonds: AssetWithDay[], ike: boolean) {
    if (bonds.length === 0) return;

    const currentDate = new Date();

    const bondData = this.bondFactoryCreator.getBondFactory('ROS');
    const bondModel = bondData.getModel() as Model<Ros>;

    const bondTypes = [];
    bonds.forEach((bond) => bondTypes.push(bond.type));
    const bondCalculateValues = await bondModel.find({ id: { $in: bondTypes } });

    const { oldestCpiYear, newestCpiYear } = this.getYearDateRangeForCpi(
      bondTypes,
      bondData.getLengthInMonths() / 12,
    );

    const cpiData = await this.cpiModel.find({
      year: {
        $gte: oldestCpiYear,
        $lte: newestCpiYear,
      },
    });

    bonds.forEach((bond) => {
      let yearsLeft = bondData.getLengthInMonths() / 12;
      let returnRate = 100;

      const result = this.validateBond(bond.type);
      if (!result) return false;

      const { month, year } = result;
      let endYear = year + 2000;

      const startDate = new Date(endYear - bondData.getLengthInMonths() / 12, month - 1, bond.day);
      const endDate = new Date(endYear, month - 1, bond.day);

      const value = bondCalculateValues.find((item) => item.id === bond.type);

      if (!value) return false;

      let firstYearValue = value.firstYear;
      let marginValue = value.margin;

      const cpiMonth = getMonthShortNameByNumber(getMonthNumberBefore(month, 2) as monthNumber);
      let startYear = endYear - bondData.getLengthInMonths() / 12;

      if (month < 2) {
        startYear--, endYear--;
      }

      const cpiFiltered = cpiData.filter((item) => item.year > startYear && item.year < endYear);
      const cpiMonthly = [];

      cpiFiltered.forEach((item) => {
        cpiMonthly.push(item[cpiMonth]);
      });

      let cpiPlusMargin = cpiMonthly.map((item) => (item < 0 ? 0 + marginValue : item + marginValue));

      //calculate

      if (isDifferenceLessThanAYear(startDate, currentDate)) {
        returnRate = calculateYearRateByDaysPassed(
          returnRate,
          firstYearValue,
          new Date(endYear - bondData.getLengthInMonths() / 12, month - 1, bond.day),
        );
        return; //?
      }
      let lastRate;
      if (endDate > currentDate) {
        lastRate = cpiPlusMargin.pop();
      }
      //first year fixed value
      returnRate = addPercentageRate(returnRate, firstYearValue);
      yearsLeft = yearsLeft - 1;

      //remaining years
      if (cpiPlusMargin.length > 0) {
        returnRate = calculateCummulatedRate(returnRate, cpiPlusMargin.length, cpiPlusMargin);
        yearsLeft = yearsLeft - cpiPlusMargin.length;
      }

      //check for ike if finished, if not calculate last year separately
      if (endDate < currentDate) {
        if (!ike) {
          returnRate -= (returnRate - 100) * this.belkaTax;
        }
      } else {
        returnRate = calculateYearRateByDaysPassed(
          returnRate,
          lastRate,
          new Date(endYear - yearsLeft, month - 1, bond.day),
        );
      }

      bond.price = bond.buyPrice * (returnRate / 100);
      bond.originalCurrencyPrice = bond.originalCurrencyBuyPrice * (returnRate / 100);
    });
  }

  private async calculateCOI(bonds: AssetWithDay[], ike: boolean) {
    if (bonds.length === 0) return;

    const currentDate = new Date();

    const bondData = this.bondFactoryCreator.getBondFactory('COI');
    const bondModel = bondData.getModel() as Model<Coi>;

    const bondTypes = [];
    bonds.forEach((bond) => bondTypes.push(bond.type));
    const bondCalculateValues = await bondModel.find({ id: { $in: bondTypes } });

    const { oldestCpiYear, newestCpiYear } = this.getYearDateRangeForCpi(
      bondTypes,
      bondData.getLengthInMonths() / 12,
    );

    const cpiData = await this.cpiModel.find({
      year: {
        $gte: oldestCpiYear,
        $lte: newestCpiYear,
      },
    });

    bonds.forEach((bond) => {
      let yearsLeft = bondData.getLengthInMonths() / 12;
      let returnRate = 100;

      const result = this.validateBond(bond.type);
      if (!result) return false;

      const { month, year } = result;
      let endYear = year + 2000;

      const startDate = new Date(endYear - bondData.getLengthInMonths() / 12, month - 1, bond.day);
      const endDate = new Date(endYear, month - 1, bond.day);

      const value = bondCalculateValues.find((item) => item.id === bond.type);

      if (!value) return false;

      let firstYearValue = value.firstYear;
      let marginValue = value.margin;

      const cpiMonth = getMonthShortNameByNumber(getMonthNumberBefore(month, 2) as monthNumber);
      let startYear = endYear - bondData.getLengthInMonths() / 12;

      if (month < 2) {
        startYear--, endYear--;
      }

      const cpiFiltered = cpiData.filter((item) => item.year > startYear && item.year < endYear);
      const cpiMonthly = [];

      cpiFiltered.forEach((item) => {
        cpiMonthly.push(item[cpiMonth]);
      });

      let cpiPlusMargin = cpiMonthly.map((item) => (item < 0 ? 0 + marginValue : item + marginValue));

      //calculate

      if (isDifferenceLessThanAYear(startDate, currentDate)) {
        returnRate = calculateYearRateByDaysPassed(
          returnRate,
          firstYearValue,
          new Date(endYear - bondData.getLengthInMonths() / 12, month - 1, bond.day),
        );
        return; //?
      }
      let lastRate;
      if (endDate > currentDate) {
        lastRate = cpiPlusMargin.pop();
      }

      const tax = ike ? 0 : this.belkaTax;

      //first year fixed value
      const firstYear = addPercentageRate(returnRate, firstYearValue) - 100;
      returnRate = returnRate + firstYear - firstYear * tax;
      yearsLeft = yearsLeft - 1;

      //remaining years
      if (cpiPlusMargin.length > 0) {
        returnRate = calculateConstantRate(returnRate, cpiPlusMargin, tax);
        yearsLeft = yearsLeft - cpiPlusMargin.length;
      }

      //check for ike if finished, if not calculate last year separately
      if (endDate < currentDate) {
        if (!ike) {
          returnRate -= (returnRate - 100) * this.belkaTax;
        }
      } else {
        returnRate = calculateYearRateByDaysPassed(
          returnRate,
          lastRate,
          new Date(endYear - yearsLeft, month - 1, bond.day),
        );
      }
      bond.price = bond.buyPrice * (returnRate / 100);
      bond.originalCurrencyPrice = bond.originalCurrencyBuyPrice * (returnRate / 100);
    });
  }

  private async calculateOTS(bonds: AssetWithDay[], ike: boolean) {
    if (bonds.length === 0) return;

    const bondData = this.bondFactoryCreator.getBondFactory('OTS');
    const bondModel = bondData.getModel() as Model<Ots>;

    const bondTypes = [];
    bonds.forEach((bond) => bondTypes.push(bond.type));
    const bondCalculateValues = await bondModel.find({ id: { $in: bondTypes } });

    const currentDate = new Date();

    bonds.forEach((bond) => {
      let returnRate = 100;

      const result = this.validateBond(bond.type);
      if (!result) return false;
      const { month, year } = result;
      let endYear = year + 2000;

      const value = bondCalculateValues.find((item) => (item.id = bond.type));
      if (!value) return false;
      let rate = value.rate;

      const endDate = new Date(endYear, month - 1, bond.day);
      const daysToEnd = differenceInDays(endDate, currentDate);

      if (daysToEnd <= 0) {
        let amount = (100 * ((rate * bondData.getLengthInMonths()) / 12)) / 100;
        if (!ike) amount = amount - amount * this.belkaTax;

        returnRate = returnRate + amount;
        return;
      } else {
        const startDate = new Date(endDate);
        startDate.setMonth(endDate.getMonth() - bondData.getLengthInMonths());

        const daysSinceStart = differenceInDays(currentDate, startDate);
        const daysPercentage = daysSinceStart / (daysSinceStart + daysToEnd);

        returnRate = returnRate + daysPercentage * ((rate * bondData.getLengthInMonths()) / 12);
      }

      bond.price = bond.buyPrice * (returnRate / 100);
      bond.originalCurrencyPrice = bond.originalCurrencyBuyPrice * (returnRate / 100);
    });
  }

  private async calculateTOS(bonds: AssetWithDay[], ike: boolean) {
    if (bonds.length === 0) return;

    const bondData = this.bondFactoryCreator.getBondFactory('TOS');
    const bondModel = bondData.getModel() as Model<Tos>;

    const bondTypes = [];
    bonds.forEach((bond) => bondTypes.push(bond.type));
    const bondCalculateValues = await bondModel.find({ id: { $in: bondTypes } });

    const currentDate = new Date();

    bonds.forEach((bond) => {
      let returnRate = 100;

      const result = this.validateBond(bond.type);
      if (!result) return false;
      const { month, year } = result;
      let endYear = year + 2000;

      const value = bondCalculateValues.find((item) => (item.id = bond.type));
      if (!value) return false;
      let rate = value.rate;

      const endDate = new Date(endYear, month - 1, bond.day);
      const startDate = new Date(endYear - bondData.getLengthInMonths() / 12, month - 1, bond.day);

      //calculate

      if (isDifferenceLessThanAYear(startDate, currentDate)) {
        returnRate = calculateYearRateByDaysPassed(
          returnRate,
          rate,
          new Date(endYear - bondData.getLengthInMonths() / 12, month - 1, bond.day),
        );
        return; //?
      }

      const daysSinceStart = differenceInDays(currentDate, startDate);

      if (daysSinceStart / 365 > bondData.getLengthInMonths() / 12) {
        for (let i = 0; i < bondData.getLengthInMonths() / 12; i++) {
          returnRate += (returnRate / 100) * rate;
        }

        if (!ike) {
          returnRate = returnRate - (returnRate - 100) * this.belkaTax;
        }
      } else {
        let daysSinceLastYear = daysSinceStart;
        let yearsToAdd = 0;
        while (daysSinceLastYear > 365) {
          returnRate += (returnRate / 100) * rate;
          daysSinceLastYear -= 365;
          yearsToAdd++;
        }

        returnRate = calculateYearRateByDaysPassed(
          returnRate,
          rate,
          new Date(endYear - bondData.getLengthInMonths() / 12 + yearsToAdd, month - 1, bond.day),
        );
      }

      bond.price = bond.buyPrice * (returnRate / 100);
      bond.originalCurrencyPrice = bond.originalCurrencyBuyPrice * (returnRate / 100);
    });
  }

  //! helpers
  private validateBond(bondString: string) {
    if (bondString.length != 7) {
      return false;
    }

    const availableTypes = ['ROR', 'DOR', 'OTS', 'TOS', 'COI', 'EDO', 'ROS', 'ROD'];

    const type = bondString.slice(0, 3).toUpperCase();
    const month = parseInt(bondString.slice(3, 5)); // "04"
    const year = parseInt(bondString.slice(5, 7)); // "34"

    if (
      !availableTypes.includes(type) ||
      isNaN(month) ||
      !(month >= 1 && month <= 12) ||
      isNaN(year) ||
      year < 20
    ) {
      console.log('invalid type', month, year);
      return false;
    }

    return { type, month, year };
  }

  private getYearDateRangeForCpi(bondTypes: string[], lengthInYears: number) {
    let oldestCpiYear = 9999;
    let newestCpiYear = 0;

    bondTypes.forEach((item) => {
      const monthString = item.slice(3, 5);
      const yearString = '20' + item.slice(5, 7);
      let month = parseInt(monthString) - 1;
      let year = parseInt(yearString);

      newestCpiYear = Math.max(year, newestCpiYear);

      if (month < 2) {
        //jan | feb
        year--;
      }
      year = year - lengthInYears;
      oldestCpiYear = Math.min(year, oldestCpiYear);
    });

    return { oldestCpiYear, newestCpiYear };
  }
}
