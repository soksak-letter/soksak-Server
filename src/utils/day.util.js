export const getWeekStartAndEnd = (date) => {
    const dayOfWeek = date.getDay();

    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() + diffToMonday);
    weekStart.setHours(0, 0, 0, 0);
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    return {weekStart, weekEnd};
}

export const getMonthAndWeek = (today) => {
    const month = today.getMonth() + 1;

    const date = today.getDate();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startDay = firstDayOfMonth.getDay();

    const week = Math.ceil((date + startDay) / 7);

    return {month, week};
}

// yearWeekToMonthWeek.js
// ESM 모듈 (Node.js). "type": "module" 환경 권장.

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function assertInt(name, value) {
  if (!Number.isInteger(value)) {
    throw new TypeError(`${name} must be an integer. got: ${value}`);
  }
}

function isLeapYear(year) {
  // Gregorian rule
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

function daysInYear(year) {
  return isLeapYear(year) ? 366 : 365;
}

function addDaysUTC(date, days) {
  return new Date(date.getTime() + days * MS_PER_DAY);
}

function fmtYMDUTC(date) {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function yearWeekToMonthWeek(year, week) {
  assertInt("year", year);
  assertInt("week", week);

  if (week < 1 || week > 52) {
    throw new RangeError(`week must be between 1 and 52. got: ${week}`);
  }

  const jan1 = new Date(Date.UTC(year, 0, 1));
  const totalDays = daysInYear(year);

  const startOffset = (week - 1) * 7;

  // 52주 고정: 마지막 주차가 남은 날짜를 전부 흡수
  const daysThisWeek =
    week === 52 ? (totalDays - 51 * 7) : 7;

  // 안전장치: (이론상 week=52만 8~9일, 나머지 7일)
  if (week !== 52 && startOffset + 7 > totalDays) {
    throw new RangeError(
      `week ${week} exceeds the year range under 52-week fixed model.`
    );
  }

  const start = addDaysUTC(jan1, startOffset);
  const end = addDaysUTC(start, daysThisWeek - 1);

  const month = start.getUTCMonth() + 1;            // 1..12
  const dayOfMonth = start.getUTCDate();           // 1..31
  const weekOfMonth = Math.floor((dayOfMonth - 1) / 7) + 1; // 1..5

  return {
    month,
    weekOfMonth,
  };
}