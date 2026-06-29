export const chartPeriodOptions = [
  {id: 'today', label: 'Сегодня', isOnline: true},
  {id: 'week', label: 'Неделя', isOnline: false},
  {id: 'month', label: 'Месяц', isOnline: false},
  {id: 'six-months', label: '6 месяцев', isOnline: false},
  {id: 'year', label: '1 год', isOnline: false},
  {id: 'two-years', label: '2 года', isOnline: false},
  {id: 'all-time', label: 'Все время', isOnline: false},
] as const;

export type ChartPeriodId = (typeof chartPeriodOptions)[number]['id'];

export const defaultChartPeriod: ChartPeriodId = 'six-months';
