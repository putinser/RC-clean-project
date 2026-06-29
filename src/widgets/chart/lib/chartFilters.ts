import {
  type ChartIntervalId,
  chartIntervalOptions,
} from '../config/chartInterval';
import {
  type ChartPeriodId,
  chartPeriodOptions,
} from '../config/chartPeriod';
import type {ChartViewId} from '../config/chartView';

export const getDateRange = (period: ChartPeriodId) => {
  const to = new Date();
  const from = new Date();

  switch (period) {
    case 'today':
      break;
    case 'week':
      from.setDate(to.getDate() - 6);
      break;
    case 'month':
      from.setMonth(to.getMonth() - 1);
      break;
    case 'six-months':
      from.setMonth(to.getMonth() - 6);
      break;
    case 'year':
      from.setFullYear(to.getFullYear() - 1);
      break;
    case 'two-years':
      from.setFullYear(to.getFullYear() - 2);
      break;
    case 'all-time':
      from.setFullYear(to.getFullYear() - 20);
      break;
  }
  return {from, to};
};

export const formatApiDate = (date: Date): number => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return Number(`${yyyy}${mm}${dd}`);
};

export const getIntervalOptions = (
  isOnline: boolean,
  view: ChartViewId,
  period: ChartPeriodId,
) => {
  const showOnline = isOnline && view !== 'asset-price' && period !== 'all-time';
  return chartIntervalOptions.filter(
    (item) => item.id === 'D' || showOnline,
  );
};

export const getPeriodOptions = (isOnline: boolean, view: ChartViewId) => {
  const showOnline = isOnline && view !== 'asset-price';
  return chartPeriodOptions.filter(
    (item) => !item.isOnline || showOnline,
  );
};

export const getApiParams = (
  interval: ChartIntervalId,
  period: ChartPeriodId,
) => {
  const {from, to} = getDateRange(period);

  const apiInterval = interval === '5m' ? 5 : interval === '1h' ? 60 : 1;
  const apiType = interval === 'D' ? 'day' : 'minute';

  return {
    from: formatApiDate(from),
    to: formatApiDate(to),
    interval: apiInterval,
    type: apiType,
  };
};
