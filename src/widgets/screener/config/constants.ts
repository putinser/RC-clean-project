import type {
  ScreenerAssetClass,
  ScreenerPeriod,
  ScreenerSortMetric,
  ScreenerView,
} from '@services/screener/types';

export const screenerShownLimit = 50;

export const screenerAssetClassOptions: {
  id: ScreenerAssetClass;
  label1: string;
}[] = [
  { id: 'stocks', label1: 'Акции' },
  { id: 'currencies', label1: 'Валюты' },
  { id: 'commodities', label1: 'Товары' },
  { id: 'indices', label1: 'Индексы' },
  { id: 'others', label1: 'Другие' },
];

export const screenerSegmentOptions = [
  { id: '0', label1: 'Юридические лица' },
  { id: '1', label1: 'Физические лица' },
];

export const screenerPeriodOptions: { id: ScreenerPeriod; label1: string }[] = [
  { id: '5m', label1: '5 мин' },
  { id: '1h', label1: '1 час' },
  { id: '1d', label1: '1 день' },
  { id: '1w', label1: '1 неделя' },
  { id: '1mo', label1: '1 месяц' },
];

export const screenerViewOptions: { id: ScreenerView; label1: string }[] = [
  { id: 'ratios', label1: 'Соотношения' },
  { id: 'changes', label1: 'Проценты' },
];

export const screenerRatioSortOptions: {
  id: ScreenerSortMetric;
  label1: string;
}[] = [
  { id: 'positions_long_ratio', label1: 'Покупки' },
  { id: 'positions_short_ratio', label1: 'Продажи' },
  { id: 'participants_long_ratio', label1: 'Покупатели' },
  { id: 'participants_short_ratio', label1: 'Продавцы' },
];

export const screenerChangeSortOptions: {
  id: ScreenerSortMetric;
  label1: string;
}[] = [
  { id: 'positions_long_change', label1: 'Покупки' },
  { id: 'positions_short_change', label1: 'Продажи' },
  { id: 'participants_long_change', label1: 'Покупатели' },
  { id: 'participants_short_change', label1: 'Продавцы' },
  { id: 'net_position_change', label1: 'Чистые позиции' },
  { id: 'net_participants_change', label1: 'Чистые участники' },
  { id: 'open_interest_positions_change', label1: 'Открытый интерес' },
  { id: 'open_interest_participants_change', label1: 'ОИ участники' },
];

export const screenerDirectionOptions = [
  { id: 'desc', label1: 'По убыванию' },
  { id: 'asc', label1: 'По возрастанию' },
];

export const assetTypeToScreenerAssetClass = {
  stock: 'stocks',
  currency: 'currencies',
  product: 'commodities',
  index: 'indices',
  other: 'others',
} as const;
