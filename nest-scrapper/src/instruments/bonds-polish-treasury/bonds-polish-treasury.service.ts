import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cpi } from '../../general/cpi/schemas/cpi.schema';
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


@Injectable()
export class BondsPolishTreasuryService {
  constructor(
    @InjectModel(Cpi.name) private cpiModel: Model<Cpi>,
    private readonly bondFactoryCreator: BondFactory,
  ) {}

  private readonly logger = new Logger(BondsPolishTreasuryService.name);
  private readonly belkaTax = 0.19; //todo extract somewhere

  async handleBond(bondString: string, day?: number, hasIke?: boolean) {
    const dayOfMonth = day || 1;
    const ike = hasIke || false;

    const result = this.validateBond(bondString);
    if (!result) return false;

    const { type, month, year } = result;

    const bondFactory = this.bondFactoryCreator.getBondFactory(type);

    if (!isValidDayOfMonth(year - Math.floor(bondFactory.getLengthInMonths() / 12), month, dayOfMonth))
      return false;

    switch (type) {
      case 'EDO': {
        return await this.calculateEDO([{ type, day }], ike);
      }
    }
  }

  async handleBondsMultiple(bonds: { type: string; day: number }[], ike: boolean) {
    const updatedBonds = [];

    const resultEDO = await this.calculateEDO(
      bonds.filter((bond) => bond.type.startsWith('EDO')),
      ike,
    );
    const resultROD = await this.calculateROD(
      bonds.filter((bond) => bond.type.startsWith('ROD')),
      ike,
    );
    const resultROS = await this.calculateROS(
      bonds.filter((bond) => bond.type.startsWith('ROS')),
      ike,
    );
    const resultCOI = await this.calculateCOI(
      bonds.filter((bond) => bond.type.startsWith('COI')),
      ike,
    );
    const resultOTS = await this.calculateOTS(
      bonds.filter((bond) => bond.type.startsWith('OTS')),
      ike,
    );
    const resultTOS = await this.calculateTOS(
      bonds.filter((bond) => bond.type.startsWith('TOS')),
      ike,
    );

    if (resultEDO.length > 0) updatedBonds.push(resultEDO);
    if (resultROD.length > 0) updatedBonds.push(resultROD);
    if (resultROS.length > 0) updatedBonds.push(resultROS);
    if (resultCOI.length > 0) updatedBonds.push(resultCOI);
    if (resultOTS.length > 0) updatedBonds.push(resultOTS);
    if (resultTOS.length > 0) updatedBonds.push(resultTOS);

    return updatedBonds.flat();
  }

  private async calculateEDO(bonds: { type: string; day: number }[], ike: boolean) {
    if (bonds.length === 0) return;
    const currentDate = new Date();

    const newBonds: {
      type: string;
      day: number;
      firstYearValue?: number;
      marginValue?: number;
      returnRate?: number;
    }[] = [...bonds];

    const bondData = this.bondFactoryCreator.getBondFactory('EDO');
    const bondModel = bondData.getModel() as Model<Edo>;

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

    newBonds.forEach((bond) => {
      let yearsLeft = bondData.getLengthInMonths() / 12;
      bond.returnRate = 100;

      const result = this.validateBond(bond.type);
      if (!result) return false;

      const { month, year } = result;
      let endYear = year + 2000;

      const startDate = new Date(endYear - bondData.getLengthInMonths() / 12, month - 1, bond.day);
      const endDate = new Date(endYear, month - 1, bond.day);

      const value = bondCalculateValues.find((item) => item.id === bond.type);

      if (!value) return false;

      bond.firstYearValue = value.firstYear;
      bond.marginValue = value.margin;

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

      let cpiPlusMargin = cpiMonthly.map((item) =>
        item < 0 ? 0 + bond.marginValue : item + bond.marginValue,
      );

      //calculate

      if (isDifferenceLessThanAYear(startDate, currentDate)) {
        bond.returnRate = calculateYearRateByDaysPassed(
          bond.returnRate,
          bond.firstYearValue,
          new Date(endYear - bondData.getLengthInMonths() / 12, month - 1, bond.day),
        );
        return; //?
      }
      let lastRate;
      if (endDate > currentDate) {
        lastRate = cpiPlusMargin.pop();
      }
      //first year fixed value
      bond.returnRate = addPercentageRate(bond.returnRate, bond.firstYearValue);
      yearsLeft = yearsLeft - 1;

      //remaining years
      if (cpiPlusMargin.length > 0) {
        bond.returnRate = calculateCummulatedRate(bond.returnRate, cpiPlusMargin.length, cpiPlusMargin);
        yearsLeft = yearsLeft - cpiPlusMargin.length;
      }

      //check for ike if finished, if not calculate last year separately
      if (endDate < currentDate) {
        if (!ike) {
          bond.returnRate -= (bond.returnRate - 100) * this.belkaTax;
        }
      } else {
        bond.returnRate = calculateYearRateByDaysPassed(
          bond.returnRate,
          lastRate,
          new Date(endYear - yearsLeft, month - 1, bond.day),
        );
      }
    });

    return newBonds;
  }

  private async calculateROD(bonds: { type: string; day: number }[], ike: boolean) {
    // if (bonds.length === 0) return;

    const currentDate = new Date();

    const newBonds: {
      type: string;
      day: number;
      firstYearValue?: number;
      marginValue?: number;
      returnRate?: number;
    }[] = [...bonds];

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

    newBonds.forEach((bond) => {
      let yearsLeft = bondData.getLengthInMonths() / 12;
      bond.returnRate = 100;

      const result = this.validateBond(bond.type);
      if (!result) return false;

      const { month, year } = result;
      let endYear = year + 2000;

      const startDate = new Date(endYear - bondData.getLengthInMonths() / 12, month - 1, bond.day);
      const endDate = new Date(endYear, month - 1, bond.day);

      const value = bondCalculateValues.find((item) => item.id === bond.type);

      if (!value) return false;

      bond.firstYearValue = value.firstYear;
      bond.marginValue = value.margin;

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

      let cpiPlusMargin = cpiMonthly.map((item) =>
        item < 0 ? 0 + bond.marginValue : item + bond.marginValue,
      );

      //calculate

      if (isDifferenceLessThanAYear(startDate, currentDate)) {
        bond.returnRate = calculateYearRateByDaysPassed(
          bond.returnRate,
          bond.firstYearValue,
          new Date(endYear - bondData.getLengthInMonths() / 12, month - 1, bond.day),
        );
        return; //?
      }
      let lastRate;
      if (endDate > currentDate) {
        lastRate = cpiPlusMargin.pop();
      }
      //first year fixed value
      bond.returnRate = addPercentageRate(bond.returnRate, bond.firstYearValue);
      yearsLeft = yearsLeft - 1;

      //remaining years
      if (cpiPlusMargin.length > 0) {
        bond.returnRate = calculateCummulatedRate(bond.returnRate, cpiPlusMargin.length, cpiPlusMargin);
        yearsLeft = yearsLeft - cpiPlusMargin.length;
      }

      //check for ike if finished, if not calculate last year separately
      if (endDate < currentDate) {
        if (!ike) {
          bond.returnRate -= (bond.returnRate - 100) * this.belkaTax;
        }
      } else {
        bond.returnRate = calculateYearRateByDaysPassed(
          bond.returnRate,
          lastRate,
          new Date(endYear - yearsLeft, month - 1, bond.day),
        );
      }
    });

    return newBonds;
  }

  private async calculateROS(bonds: { type: string; day: number }[], ike: boolean) {
    // if (bonds.length === 0) return;

    const currentDate = new Date();

    const newBonds: {
      type: string;
      day: number;
      firstYearValue?: number;
      marginValue?: number;
      returnRate?: number;
    }[] = [...bonds];

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

    newBonds.forEach((bond) => {
      let yearsLeft = bondData.getLengthInMonths() / 12;
      bond.returnRate = 100;

      const result = this.validateBond(bond.type);
      if (!result) return false;

      const { month, year } = result;
      let endYear = year + 2000;

      const startDate = new Date(endYear - bondData.getLengthInMonths() / 12, month - 1, bond.day);
      const endDate = new Date(endYear, month - 1, bond.day);

      const value = bondCalculateValues.find((item) => item.id === bond.type);

      if (!value) return false;

      bond.firstYearValue = value.firstYear;
      bond.marginValue = value.margin;

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

      let cpiPlusMargin = cpiMonthly.map((item) =>
        item < 0 ? 0 + bond.marginValue : item + bond.marginValue,
      );

      //calculate

      if (isDifferenceLessThanAYear(startDate, currentDate)) {
        bond.returnRate = calculateYearRateByDaysPassed(
          bond.returnRate,
          bond.firstYearValue,
          new Date(endYear - bondData.getLengthInMonths() / 12, month - 1, bond.day),
        );
        return; //?
      }
      let lastRate;
      if (endDate > currentDate) {
        lastRate = cpiPlusMargin.pop();
      }
      //first year fixed value
      bond.returnRate = addPercentageRate(bond.returnRate, bond.firstYearValue);
      yearsLeft = yearsLeft - 1;

      //remaining years
      if (cpiPlusMargin.length > 0) {
        bond.returnRate = calculateCummulatedRate(bond.returnRate, cpiPlusMargin.length, cpiPlusMargin);
        yearsLeft = yearsLeft - cpiPlusMargin.length;
      }

      //check for ike if finished, if not calculate last year separately
      if (endDate < currentDate) {
        if (!ike) {
          bond.returnRate -= (bond.returnRate - 100) * this.belkaTax;
        }
      } else {
        bond.returnRate = calculateYearRateByDaysPassed(
          bond.returnRate,
          lastRate,
          new Date(endYear - yearsLeft, month - 1, bond.day),
        );
      }
    });

    return newBonds;
  }

  private async calculateCOI(bonds: { type: string; day: number }[], ike: boolean) {
    const currentDate = new Date();

    const newBonds: {
      type: string;
      day: number;
      firstYearValue?: number;
      marginValue?: number;
      returnRate?: number;
    }[] = [...bonds];

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

    newBonds.forEach((bond) => {
      let yearsLeft = bondData.getLengthInMonths() / 12;
      bond.returnRate = 100;

      const result = this.validateBond(bond.type);
      if (!result) return false;

      const { month, year } = result;
      let endYear = year + 2000;

      const startDate = new Date(endYear - bondData.getLengthInMonths() / 12, month - 1, bond.day);
      const endDate = new Date(endYear, month - 1, bond.day);

      const value = bondCalculateValues.find((item) => item.id === bond.type);

      if (!value) return false;

      bond.firstYearValue = value.firstYear;
      bond.marginValue = value.margin;

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

      let cpiPlusMargin = cpiMonthly.map((item) =>
        item < 0 ? 0 + bond.marginValue : item + bond.marginValue,
      );

      //calculate

      if (isDifferenceLessThanAYear(startDate, currentDate)) {
        bond.returnRate = calculateYearRateByDaysPassed(
          bond.returnRate,
          bond.firstYearValue,
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
      const firstYear = addPercentageRate(bond.returnRate, bond.firstYearValue) - 100;
      bond.returnRate = bond.returnRate + firstYear - firstYear * tax;
      yearsLeft = yearsLeft - 1;

      //remaining years
      if (cpiPlusMargin.length > 0) {
        bond.returnRate = calculateConstantRate(bond.returnRate, cpiPlusMargin, tax);
        yearsLeft = yearsLeft - cpiPlusMargin.length;
      }

      //check for ike if finished, if not calculate last year separately
      if (endDate < currentDate) {
        if (!ike) {
          bond.returnRate -= (bond.returnRate - 100) * this.belkaTax;
        }
      } else {
        bond.returnRate = calculateYearRateByDaysPassed(
          bond.returnRate,
          lastRate,
          new Date(endYear - yearsLeft, month - 1, bond.day),
        );
      }
    });

    return newBonds;
  }

  private async calculateOTS(bonds: { type: string; day: number }[], ike: boolean) {
    const newBonds: {
      type: string;
      day: number;
      rate?: number;
      returnRate?: number;
    }[] = [...bonds];

    const bondData = this.bondFactoryCreator.getBondFactory('OTS');
    const bondModel = bondData.getModel() as Model<Ots>;

    const bondTypes = [];
    bonds.forEach((bond) => bondTypes.push(bond.type));
    const bondCalculateValues = await bondModel.find({ id: { $in: bondTypes } });

    const currentDate = new Date();

    newBonds.forEach((bond) => {
      bond.returnRate = 100;

      const result = this.validateBond(bond.type);
      if (!result) return false;
      const { month, year } = result;
      let endYear = year + 2000;

      const value = bondCalculateValues.find((item) => (item.id = bond.type));
      if (!value) return false;
      bond.rate = value.rate;

      const endDate = new Date(endYear, month - 1, bond.day);
      const daysToEnd = differenceInDays(endDate, currentDate);

      if (daysToEnd <= 0) {
        let amount = (100 * ((bond.rate * bondData.getLengthInMonths()) / 12)) / 100;
        if (!ike) amount = amount - amount * this.belkaTax;

        bond.returnRate = bond.returnRate + amount;
        return;
      } else {
        const startDate = new Date(endDate);
        startDate.setMonth(endDate.getMonth() - bondData.getLengthInMonths());

        const daysSinceStart = differenceInDays(currentDate, startDate);
        const daysPercentage = daysSinceStart / (daysSinceStart + daysToEnd);

        bond.returnRate =
          bond.returnRate + daysPercentage * ((bond.rate * bondData.getLengthInMonths()) / 12);
      }
    });

    return newBonds;
  }

  private async calculateTOS(bonds: { type: string; day: number }[], ike: boolean) {
    const newBonds: {
      type: string;
      day: number;
      rate?: number;
      returnRate?: number;
    }[] = [...bonds];

    const bondData = this.bondFactoryCreator.getBondFactory('TOS');
    const bondModel = bondData.getModel() as Model<Tos>;

    const bondTypes = [];
    bonds.forEach((bond) => bondTypes.push(bond.type));
    const bondCalculateValues = await bondModel.find({ id: { $in: bondTypes } });

    const currentDate = new Date();

    newBonds.forEach((bond) => {
      bond.returnRate = 100;

      const result = this.validateBond(bond.type);
      if (!result) return false;
      const { month, year } = result;
      let endYear = year + 2000;

      const value = bondCalculateValues.find((item) => (item.id = bond.type));
      if (!value) return false;
      bond.rate = value.rate;

      const endDate = new Date(endYear, month - 1, bond.day);
      const startDate = new Date(endYear - bondData.getLengthInMonths() / 12, month - 1, bond.day);

      //calculate

      if (isDifferenceLessThanAYear(startDate, currentDate)) {
        bond.returnRate = calculateYearRateByDaysPassed(
          bond.returnRate,
          bond.rate,
          new Date(endYear - bondData.getLengthInMonths() / 12, month - 1, bond.day),
        );
        return; //?
      }

      const daysSinceStart = differenceInDays(currentDate, startDate);

      if (daysSinceStart / 365 > bondData.getLengthInMonths() / 12) {
        for (let i = 0; i < bondData.getLengthInMonths() / 12; i++) {
          bond.returnRate += (bond.returnRate / 100) * bond.rate;
        }

        if (!ike) {
          bond.returnRate = bond.returnRate - (bond.returnRate - 100) * this.belkaTax;
        }
      } else {
        let daysSinceLastYear = daysSinceStart;
        let yearsToAdd = 0;
        while (daysSinceLastYear > 365) {
          bond.returnRate += (bond.returnRate / 100) * bond.rate;
          daysSinceLastYear -= 365;
          yearsToAdd++;
        }

        bond.returnRate = calculateYearRateByDaysPassed(
          bond.returnRate,
          bond.rate,
          new Date(endYear - bondData.getLengthInMonths() / 12 + yearsToAdd, month - 1, bond.day),
        );
      }
    });

    return newBonds;
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

  private getYearDateRangeForCpi(bondTypes: string[], lengthInYears) {
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
