import type {AssetItem, AssetValue} from '@services/assets/types';

export const parseChartMoment = (moment: string) =>
  new Date(moment.includes('T') ? moment : moment.replace(' ', 'T')).getTime();

export const sortChartItemsByMoment = <T extends {moment: string}>(items: T[]) =>
  [...items].sort(
    (left, right) =>
      parseChartMoment(left.moment) - parseChartMoment(right.moment),
  );

export const getChartPriceValue = (
  value: AssetValue | number | null | undefined,
): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (
    value &&
    typeof value === 'object' &&
    typeof value.open === 'number' &&
    Number.isFinite(value.open)
  ) {
    return value.open;
  }

  return null;
};


export const toChartTimePoint = (moment: string, value: number) =>
  [parseChartMoment(moment), value] as [number, number];

export const mapLegalSeriesPoint = (
  item: AssetItem,
  getValue: (value: AssetValue) => number,
  shiftValue: (value: number) => number,
) => toChartTimePoint(item.moment, shiftValue(getValue(item.value)));
