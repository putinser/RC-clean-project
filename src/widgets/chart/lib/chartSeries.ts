import type {AssetItem, AssetValue} from '@services/assets/types';

export const parseChartMoment = (moment: string) =>
  new Date(moment.includes('T') ? moment : moment.replace(' ', 'T')).getTime();

export const sortChartItemsByMoment = <T extends {moment: string}>(items: T[]) =>
  [...items].sort(
    (left, right) =>
      parseChartMoment(left.moment) - parseChartMoment(right.moment),
  );

export const getChartPriceValue = (value: AssetValue | number) =>
  typeof value === 'number' ? value : value.open;

export const toChartTimePoint = (moment: string, value: number) =>
  [parseChartMoment(moment), value] as [number, number];

export const mapLegalSeriesPoint = (
  item: AssetItem,
  getValue: (value: AssetValue) => number,
  shiftValue: (value: number) => number,
) => toChartTimePoint(item.moment, shiftValue(getValue(item.value)));
