import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from 'dayjs/plugin/timezone.js';
import isoWeek from 'dayjs/plugin/isoWeek.js';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isoWeek);

function toUTCDateOnly(d) {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
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

export function getISOYear(date = new Date()) {
  const d = toUTCDateOnly(date);

  const dayNum = d.getUTCDay() || 7;

  d.setUTCDate(d.getUTCDate() + 4 - dayNum);

  return d.getUTCFullYear();
}

export function getISOWeek(date = new Date()) {
  const d = toUTCDateOnly(date);

  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);

  const isoYear = d.getUTCFullYear();
  const yearStart = new Date(Date.UTC(isoYear, 0, 1));

  const yearStartDayNum = yearStart.getUTCDay() || 7;

  const firstThursday = new Date(yearStart);
  firstThursday.setUTCDate(yearStart.getUTCDate() + (4 - yearStartDayNum));

  const diffMs = d - firstThursday;
  const week = 1 + Math.round(diffMs / (7 * 24 * 60 * 60 * 1000));

  return week;
}

export const getToday = (date) => {
  return dayjs(date).utc().toDate();
}

export const getWeekStartAndEnd = (date) => {
  const userDate = dayjs(date);

  const weekStart = userDate.startOf("isoWeek");
  const weekEnd = userDate.endOf("isoWeek");

  return {
    weekStart: weekStart.utc().toDate(), 
    weekEnd: weekEnd.utc().toDate()
  };
}

export const getDayStartAndEnd = (date) => {
  const userDate = dayjs(date);

  const startTime = userDate.startOf("day");
  const endTime = userDate.endOf("day");

  return { 
    startTime: startTime.utc().toDate(), 
    endTime: endTime.utc().toDate()
  };
}

export const getMonthAndWeek = (date) => {
  const userDate = dayjs(date);

  const thursday = userDate.isoWeekday(4);
  
  const month = thursday.month() + 1;

  const firstThursday = thursday.startOf('month').isoWeekday(4);
  
  const actualFirstThursday = firstThursday.month() !== thursday.month() 
    ? firstThursday.add(1, 'week') 
    : firstThursday;

  const week = thursday.isoWeek() - actualFirstThursday.isoWeek() + 1;

  return { month, week };
};