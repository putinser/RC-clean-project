import {serviceAssets} from '@services/assets';
import type {
  AssetItem,
  GetAssetsParams,
  PriceReportItem,
  RsiReportItem,
} from '@services/assets/types';

export type ChartViewId =
  | 'buy-sell'
  | 'buyers-sellers'
  | 'signals'
  | 'asset-price';

export const chartViewOptions = [
  {id: 'buy-sell', label1: 'Покупки-Продажи'},
  {id: 'buyers-sellers', label1: 'Покупатели-Продавцы'},
  {id: 'signals', label1: 'Сигналы'},
  {id: 'asset-price', label1: 'Цена актива'},
];

export const defaultChartView: ChartViewId = 'buy-sell';

export type ChartDataMode = 'position' | 'rsi' | 'price-only';

type ChartPositionFetcher = (params: GetAssetsParams) => Promise<AssetItem[]>;
type ChartRsiFetcher = (params: GetAssetsParams) => Promise<RsiReportItem[]>;
type ChartPriceReportFetcher = (
  params: GetAssetsParams,
) => Promise<PriceReportItem[]>;

export const getChartDataMode = (view: ChartViewId): ChartDataMode | null => {
  if (view === 'buy-sell' || view === 'buyers-sellers') return 'position';
  if (view === 'signals') return 'rsi';
  if (view === 'asset-price') return 'price-only';
  return null;
};

export const getChartPositionFetcher = (
  view: ChartViewId,
): ChartPositionFetcher | null => {
  if (view === 'buy-sell') return serviceAssets.getAssetsLegal;
  if (view === 'buyers-sellers') return serviceAssets.getAssetsIndividual;
  return null;
};

export const getChartRsiFetcher = (
  view: ChartViewId,
): ChartRsiFetcher | null => {
  if (view === 'signals') return serviceAssets.getAssetsRsi;
  return null;
};

export const getChartPriceReportFetcher = (
  view: ChartViewId,
): ChartPriceReportFetcher | null => {
  if (view === 'asset-price') return serviceAssets.getAssetsPriceReport;
  return null;
};

export const getChartPriceReportType = (
  view: ChartViewId,
): string | undefined => {
  if (view === 'buy-sell') return 'legal';
  if (view === 'buyers-sellers') return 'individual';
  return undefined;
};
