
export const SECONDS_PER_MINUTE = 60;
export const SECONDS_PER_HOUR = SECONDS_PER_MINUTE * 60;
export const SECONDS_PER_DAY = SECONDS_PER_HOUR * 24;
export const SECONDS_PER_YEAR = SECONDS_PER_DAY * 365;
export const SECONDS_PER_LEAP_YEAR = SECONDS_PER_DAY * 366;

export const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
export const DAYS_IN_LEAP_MONTH = [
  31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31,
];

export const isLeapYear = (year: number): boolean => {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};

export const getDaysInMonth = (year: number, month: number): number => {
  return isLeapYear(year) ? DAYS_IN_LEAP_MONTH[month] : DAYS_IN_MONTH[month];
};

export const secondsToDate = (
  totalSeconds: number
): {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
} => {
  if (totalSeconds < 0) {
    throw new Error("Seconds cannot be negative");
  }

  let year = 0;
  let secondsInYear = isLeapYear(year) ? 366 * 24 * 60 * 60 : 365 * 24 * 60 * 60;

  while (totalSeconds >= secondsInYear) {
    totalSeconds -= secondsInYear;
    year++;
    secondsInYear = isLeapYear(year) ? 366 * 24 * 60 * 60 : 365 * 24 * 60 * 60;
  }

  let month = 0;
  let daysInMonth = getDaysInMonth(year, month);
  let secondsInMonth = daysInMonth * 24 * 60 * 60;

  while (totalSeconds >= secondsInMonth) {
    totalSeconds -= secondsInMonth;
    month++;
    daysInMonth = getDaysInMonth(year, month);
    secondsInMonth = daysInMonth * 24 * 60 * 60;
  }

  const day = Math.floor(totalSeconds / (24 * 60 * 60));
  totalSeconds %= 24 * 60 * 60;

  const hour = Math.floor(totalSeconds / (60 * 60));
  totalSeconds %= 60 * 60;

  const minute = Math.floor(totalSeconds / 60);
  const second = totalSeconds % 60;

  return { year, month: month + 1, day: day + 1, hour, minute, second };
};

export const dateToSeconds = (date: {
  year: number;
  month: number;
  day: number;
  hour?: number;
  minute?: number;
  second?: number;
}): number => {
  let totalSeconds = 0;

  for (let y = 0; y < date.year; y++) {
    totalSeconds += (isLeapYear(y) ? 366 : 365) * 24 * 60 * 60;
  }

  for (let m = 0; m < date.month - 1; m++) {
    totalSeconds += getDaysInMonth(date.year, m) * 24 * 60 * 60;
  }

  totalSeconds += (date.day - 1) * 24 * 60 * 60;
  totalSeconds += (date.hour || 0) * 60 * 60;
  totalSeconds += (date.minute || 0) * 60;
  totalSeconds += date.second || 0;

  return totalSeconds;
};

export const getDayOfWeek = (
  year: number,
  month: number,
  day: number
): number => {
  const totalDays = dateToSeconds({ year, month, day }) / (24 * 60 * 60) + 1;
  // Assuming 0000-01-01 is Saturday (6). Sunday is 0.
  return (totalDays + 5) % 7;
};
