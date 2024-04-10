// type StringDate = `${number}-${number}-${number}`;

// type StringTime = `${number}:${number}:${number}`;

// type StringDateType = `${StringDate}_${StringTime}`;

export const parseStringDate = (stringDate: string) => {
  const [time, date] = stringDate.split('_');
  const [hour, minute, second] = time.split(':');
  const [year, month, day] = date.split('-');

  // Create a new Date object
  return new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute),
    Number(second),
  );
};


//todo validate basing on ticker's specific market open hours (tokyo/lon/US)
export const isToday = (date: Date) => {
  const today = new Date();
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth();
  const todayDay = today.getDate();

  // Compare with the given date
  return (
    date.getFullYear() === todayYear &&
    date.getMonth() === todayMonth &&
    date.getDate() === todayDay
  );
};

export const isWeekend = (date: Date) => {
  const dayOfWeek = date.getDay(); // 0 for Sunday, 1 for Monday, ..., 6 for Saturday
  return dayOfWeek === 0 || dayOfWeek === 6; // Sunday or Saturday
};