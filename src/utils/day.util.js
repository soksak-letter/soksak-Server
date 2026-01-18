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