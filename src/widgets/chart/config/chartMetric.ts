import type {AssetValue} from '@services/assets/types';
import type {ChartViewId} from './chartView';

export type ChartMetricId =
  | 'sales'
  | 'purchases'
  | 'buy-sell'
  | 'buyers-sellers'
  | 'pure_position'
  | 'open_interest';

export type LegalSeriesConfig = {
  id: string;
  name: string;
  color: string;
  getValue: (value: AssetValue) => number;
};

export type MetricOption = {
  id: ChartMetricId;
  label1: string;
  label2?: string;
  color1: string;
  color2?: string;
};

const buySellMetricOptions: MetricOption[] = [
  {id: 'sales', label1: 'Продажи', color1: '#E53935'},
  {id: 'purchases', label1: 'Покупки', color1: '#B8E62E'},
  {
    id: 'buy-sell',
    label1: 'Продажи',
    label2: 'Покупки',
    color1: '#E53935',
    color2: '#B8E62E',
  },
  {id: 'pure_position', label1: 'Чистая позиция', color1: '#B5BD4D'},
  {id: 'open_interest', label1: 'Открытый интерес', color1: '#FF9800'},
];

const buyersSellersMetricOptions: MetricOption[] = [
  {id: 'sales', label1: 'Продавцы', color1: '#E8489A'},
  {id: 'purchases', label1: 'Покупатели', color1: '#3D8BF2'},
  {
    id: 'buyers-sellers',
    label1: 'Продавцы',
    label2: 'Покупатели',
    color1: '#E8489A',
    color2: '#3D8BF2',
  },
  {id: 'pure_position', label1: 'Чистая позиция', color1: '#8E6BF5'},
  {id: 'open_interest', label1: 'Открытый интерес', color1: '#1ECAD3'},
];

export const defaultChartMetric: ChartMetricId = 'pure_position';

export const getMetricOptions = (view: ChartViewId): MetricOption[] | null => {
  if (view === 'buy-sell') return buySellMetricOptions;
  if (view === 'buyers-sellers') return buyersSellersMetricOptions;
  return null;
};

const buySellSeriesByMetric: Record<
  ChartMetricId,
  LegalSeriesConfig[] | undefined
> = {
  sales: [
    {
      id: 'sales',
      name: 'Продажи',
      color: '#E53935',
      getValue: (value) => value.short,
    },
  ],
  purchases: [
    {
      id: 'purchases',
      name: 'Покупки',
      color: '#B8E62E',
      getValue: (value) => value.long,
    },
  ],
  'buy-sell': [
    {
      id: 'sales',
      name: 'Продажи',
      color: '#E53935',
      getValue: (value) => value.short,
    },
    {
      id: 'purchases',
      name: 'Покупки',
      color: '#B8E62E',
      getValue: (value) => value.long,
    },
  ],
  pure_position: [
    {
      id: 'pure_position',
      name: 'Чистая позиция',
      color: '#FFAA2B',
      getValue: (value) => value.pure,
    },
  ],
  open_interest: [
    {
      id: 'open_interest',
      name: 'Открытый интерес',
      color: '#FF9800',
      getValue: (value) => value.open,
    },
  ],
  'buyers-sellers': undefined,
};

const buyersSellersSeriesByMetric: Record<
  ChartMetricId,
  LegalSeriesConfig[] | undefined
> = {
  sales: [
    {
      id: 'sales',
      name: 'Продавцы',
      color: '#E8489A',
      getValue: (value) => value.short,
    },
  ],
  purchases: [
    {
      id: 'purchases',
      name: 'Покупатели',
      color: '#3D8BF2',
      getValue: (value) => value.long,
    },
  ],
  'buyers-sellers': [
    {
      id: 'sales',
      name: 'Продавцы',
      color: '#E8489A',
      getValue: (value) => value.short,
    },
    {
      id: 'purchases',
      name: 'Покупатели',
      color: '#3D8BF2',
      getValue: (value) => value.long,
    },
  ],
  pure_position: [
    {
      id: 'pure_position',
      name: 'Чистая позиция',
      color: '#8E6BF5',
      getValue: (value) => value.pure,
    },
  ],
  open_interest: [
    {
      id: 'open_interest',
      name: 'Открытый интерес',
      color: '#1ECAD3',
      getValue: (value) => value.open,
    },
  ],
  'buy-sell': undefined,
};

const defaultLegalSeries = buySellSeriesByMetric.pure_position;

export const getLegalSeriesConfigs = (
  metric: ChartMetricId,
  view: ChartViewId,
): LegalSeriesConfig[] => {
  const configsByMetric =
    view === 'buyers-sellers'
      ? buyersSellersSeriesByMetric
      : buySellSeriesByMetric;

  return configsByMetric[metric] ?? defaultLegalSeries ?? [];
};

export const getLegalSeriesLabel = (
  name: string,
  isFiz: boolean,
  metric: ChartMetricId,
) => {
  if (metric === 'pure_position') {
    return `${isFiz ? 'Физ. лица' : 'Юр. лица'} (${name})`;
  }

  return name;
};
