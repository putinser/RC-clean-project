export const chartIntervalOptions = [
  {id: '5m', label: '5м'},
  {id: '1h', label: '1ч'},
  {id: 'D', label: 'Д'},
] as const;

export type ChartIntervalId = (typeof chartIntervalOptions)[number]['id'];

export const defaultChartInterval: ChartIntervalId = '1h';
