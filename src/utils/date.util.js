function toUTCDateOnly(d) {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
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

export const getDayStartAndEnd = (date) => {
  const startTime = new Date(date);
  const endTime = new Date(date);

  startTime.setHours(0, 0, 0, 0);
  endTime.setHours(23, 59, 59, 999);

  return { startTime, endTime };
}

export const getMonthAndWeek = (today) => {
  const month = today.getMonth() + 1;

  const date = today.getDate();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const startDay = firstDayOfMonth.getDay();

  const week = Math.ceil((date + startDay) / 7);

  return {month, week};
}