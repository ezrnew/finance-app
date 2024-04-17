export const addPercentageRate = (value: number, rate: number) => {
  return value + (value * rate) / 100;
};

export const calculateCummulatedRate = (amount, yearsLeft, cpiArr) => {
  if (yearsLeft === 1) return (amount += amount * (cpiArr[cpiArr.length - 1] / 100));
  else
    return calculateCummulatedRate(
      (amount += amount * (cpiArr[cpiArr.length - yearsLeft] / 100)),
      yearsLeft - 1,
      cpiArr,
    );
};

export const calculateConstantRate = (amount, cpiArr) => {
    
    let newAmount=amount
    cpiArr.forEach(element => {
        newAmount+=element
    });

    return newAmount
  };

export const calculateYearRateByDaysPassed = (value: number, rate: number, lastYearStartDate: Date) => {
  const currentDate = new Date();

  const differenceMs = currentDate.getTime() - lastYearStartDate.getTime();

  const differenceDays = Math.floor(differenceMs / (1000 * 60 * 60 * 24));

  console.log('Różnica w dniach:', differenceDays);
  console.log('value', value);
  console.log('rate', rate);

  const percentageOfRate = isLeapYear(currentDate.getFullYear())
    ? differenceDays / 366
    : differenceDays / 365;
  console.log('percentage of rate', percentageOfRate);
  const percentageOfPercentagexd = percentageOfRate * rate;
  console.log('percentage of drugie', percentageOfPercentagexd);
  return addPercentageRate(value, percentageOfPercentagexd);
};

export const isLeapYear = (year) => {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};
