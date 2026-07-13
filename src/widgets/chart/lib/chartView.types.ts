import type {
  Asset,
  AssetItem,
  PriceReportItem,
  RsiReportItem,
} from '@services/assets/types';
import type {ChartMetricId} from '../config/chartMetric';
import type {ChartViewId} from '../config/chartView';
import type {ChartSkiaData} from './chartSkia.types';

export interface ChartViewProps {
  assetsLegal: AssetItem[];
  assetsPrice: AssetItem[];
  assetsRsi: RsiReportItem[];
  assetsPriceReport: PriceReportItem[];
  selectedAsset?: Asset;
  view: ChartViewId;
  metric: ChartMetricId;
  isFiz?: boolean;
  isLoading?: boolean;
}

export interface ChartLegalSeriesItem {
  id: string;
  name: string;
  color: string;
  latestValue: number | undefined;
}

export interface ChartAssetStats {
  latestPrice: number | undefined;
  changeValue: number | undefined;
  changePerc: number | undefined;
}

export interface ChartPriceLineColors {
  line: string;
  labelText: string;
}

export interface ChartViewModel {
  chartKey: string;
  chartData: ChartSkiaData | null;
  legalSeries: ChartLegalSeriesItem[];
  priceColor: string;
  assetStats: ChartAssetStats;
  hasChartData: boolean;
  showPrice: boolean;
  latestSignalValue?: number;
  signalThresholds?: {
    overbought: number;
    oversold: number;
  };
}
