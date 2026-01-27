// src/utils/date.js
// ISO week/year 계산 (주간 리포트에 딱 맞음)
// ISO 규칙: 주는 월요일 시작, 1주차는 "그 해 첫 목요일"이 포함된 주

function toUTCDateOnly(d) {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

export function getISOWeekYear(date = new Date()) {
  const d = toUTCDateOnly(date);

  // ISO: Monday=1..Sunday=7 로 맞춤
  const dayNum = d.getUTCDay() || 7;

  // 이번 주의 목요일로 이동 (ISO week-year 결정용)
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);

  return d.getUTCFullYear();
}

export function getISOWeek(date = new Date()) {
  const d = toUTCDateOnly(date);

  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);

  const isoYear = d.getUTCFullYear();
  const yearStart = new Date(Date.UTC(isoYear, 0, 1));

  // yearStart의 ISO day
  const yearStartDayNum = yearStart.getUTCDay() || 7;

  // yearStart를 그 해의 첫 ISO 주 목요일 기준으로 정렬
  const firstThursday = new Date(yearStart);
  firstThursday.setUTCDate(yearStart.getUTCDate() + (4 - yearStartDayNum));

  // 주차 계산
  const diffMs = d - firstThursday;
  const week = 1 + Math.round(diffMs / (7 * 24 * 60 * 60 * 1000));

  return week;
}

// 너가 bootstrap에서 쓰는 이름 그대로 제공
export function getCurrentISOYear() {
  return getISOWeekYear(new Date());
}

export function getCurrentISOWeek() {
  return getISOWeek(new Date());
}
