import type {ChartIntervalId} from '../config/chartInterval';
import type {ChartPeriodId} from '../config/chartPeriod';
import {type ChartViewId, getChartDataMode} from '../config/chartView';
import {fetchChartData} from '../lib/fetchChartData';
import {
  buildChartDataCacheKey,
  fetchCachedChartData,
  getCachedChartData,
} from './chartDataCache';

type EnsureChartDataParams = {
  view: ChartViewId;
  resolvedSelectedAssetId: string | null;
  interval: ChartIntervalId;
  period: ChartPeriodId;
  isFiz: boolean;
  isAuthorized: boolean;
};

export const ensureChartDataLoaded = ({
  view,
  resolvedSelectedAssetId,
  interval,
  period,
  isFiz,
  isAuthorized,
}: EnsureChartDataParams) => {
  const chartDataMode = getChartDataMode(view);

  if (!chartDataMode || !resolvedSelectedAssetId) {
    return Promise.resolve();
  }

  const cacheKey = buildChartDataCacheKey({
    view,
    selectedAssetId: resolvedSelectedAssetId,
    interval,
    period,
    isFiz,
    isAuthorized,
  });

  if (getCachedChartData(cacheKey)) {
    return Promise.resolve();
  }

  return fetchCachedChartData(cacheKey, () =>
    fetchChartData({
      view,
      selectedAssetId: resolvedSelectedAssetId,
      interval,
      period,
      isFiz,
    }),
  ).then(() => undefined);
};
