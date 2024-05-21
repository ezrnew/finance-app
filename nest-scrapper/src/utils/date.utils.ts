export const parseStringDate = (stringDate: string) => {
  const [time, date] = stringDate.split('_');
  const [hour, minute, second] = time.split(':');
  const [year, month, day] = date.split('-');

  // Create a new Date object
  return new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute), Number(second));
};
export const isToday = (date: Date) => {
  const today = new Date();
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth();
  const todayDay = today.getDate();

  return date.getFullYear() === todayYear && date.getMonth() === todayMonth && date.getDate() === todayDay;
};

export const isWeekend = (date: Date) => {
  const dayOfWeek = date.getDay();
  return dayOfWeek === 0 || dayOfWeek === 6;
};

export type monthNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
export const getPolishMonthNameByNumber = (num: monthNumber) => {
  switch (num) {
    case 1:
      return 'Styczeń';
    case 2:
      return 'Luty';
    case 3:
      return 'Marzec';
    case 4:
      return 'Kwiecień';
    case 5:
      return 'Maj';
    case 6:
      return 'Czerwiec';
    case 7:
      return 'Lipiec';
    case 8:
      return 'Sierpień';
    case 9:
      return 'Wrzesień';
    case 10:
      return 'Październik';
    case 11:
      return 'Listopad';
    case 12:
      return 'Grudzień';
    default:
      return 'Invalid month number';
  }
};

export const getMonthShortNameByNumber = (num: monthNumber) => {
  switch (num) {
    case 1:
      return 'jan';
    case 2:
      return 'feb';
    case 3:
      return 'mar';
    case 4:
      return 'apr';
    case 5:
      return 'may';
    case 6:
      return 'jun';
    case 7:
      return 'jul';
    case 8:
      return 'aug';
    case 9:
      return 'sep';
    case 10:
      return 'oct';
    case 11:
      return 'nov';
    case 12:
      return 'dec';
  }
};

export const getMonthNumberBefore = (month: number, num: number) => {
  return month - num > 0 ? month - num : month - num + 12;
};

export function isDifferenceLessThanAYear(date1: Date, date2: Date): boolean {
  const oneYearInMilliseconds: number = 365 * 24 * 60 * 60 * 1000;
  const difference: number = Math.abs(date1.getTime() - date2.getTime());
  return difference < oneYearInMilliseconds;
}

export function isDateBeforeOtherDateIgnoringYear(date1: Date, date2: Date): boolean {
  const adjustedDate1 = new Date(date1);
  adjustedDate1.setFullYear(2000);
  const adjustedDate2 = new Date(date2);
  adjustedDate2.setFullYear(2000);

  return adjustedDate1 < adjustedDate2;
}

export const differenceInDays = (date1: Date, date2: Date) => {
  const differenceMs = date1.getTime() - date2.getTime();
  const differenceDays = Math.floor(differenceMs / (1000 * 60 * 60 * 24));

  return differenceDays;
};

export function subtractMonthsFromDate(date: Date, months: number): Date {
  const newDate = new Date(date);
  newDate.setMonth(date.getMonth() - months);
  return newDate;
}

export function isValidDayOfMonth(year: number, month: number, day: number): boolean {
  if (month < 1 || month > 12) {
    return false;
  }

  if (month === 2) {
    if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
      return day >= 1 && day <= 29;
    } else {
      return day >= 1 && day <= 28;
    }
  }

  if ([4, 6, 9, 11].includes(month)) {
    return day >= 1 && day <= 30;
  }

  return day >= 1 && day <= 31;
}

export function IsDateOlderThanXHours(dateString: string, hours: number) {
  const dateObject = new Date(dateString);
  const differenceInHours = Math.abs(Date.now() - dateObject.getTime()) / (1000 * 60 * 60);

  return differenceInHours > hours;
}
