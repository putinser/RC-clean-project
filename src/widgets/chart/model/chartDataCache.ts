import type {
  AssetItem,
  PriceReportItem,
  RsiReportItem,
} from '@services/assets/types';
import type {ChartIntervalId} from '../config/chartInterval';
import type {ChartPeriodId} from '../config/chartPeriod';
import type {ChartViewId} from '../config/chartView';

export type ChartDataCacheEntry = {
  assetsLegal: AssetItem[];
  assetsPrice: AssetItem[];
  assetsRsi: RsiReportItem[];
  assetsPriceReport: PriceReportItem[];
};

const cache = new Map<string, ChartDataCacheEntry>();
const inflight = new Map<string, Promise<ChartDataCacheEntry>>();

export type ChartDataCacheParams = {
  view: ChartViewId;
  selectedAssetId: string;
  interval: ChartIntervalId;
  period: ChartPeriodId;
  isFiz: boolean;
  isAuthorized: boolean;
};

export const buildChartDataCacheKey = (params: ChartDataCacheParams) =>
  `${params.view}:${params.selectedAssetId}:${params.interval}:${params.period}:${params.isFiz}:${params.isAuthorized}`;

export const getCachedChartData = (key: string) => cache.get(key);

export const setCachedChartData = (key: string, data: ChartDataCacheEntry) => {
  cache.set(key, data);
};

export const fetchCachedChartData = (
  key: string,
  fetcher: () => Promise<ChartDataCacheEntry>,
) => {
  const cached = cache.get(key);
  if (cached) {
    return Promise.resolve(cached);
  }

  const pending = inflight.get(key);
  if (pending) {
    return pending;
  }

  const promise = fetcher()
    .then((data) => {
      cache.set(key, data);
      inflight.delete(key);
      return data;
    })
    .catch((error) => {
      inflight.delete(key);
      throw error;
    });

  inflight.set(key, promise);
  return promise;
};
