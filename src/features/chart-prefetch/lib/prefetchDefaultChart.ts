import {fetchAssetsList} from '@entities/asset';
import {EassetTypes} from '@widgets/chart/config/assetTypes';
import {defaultChartInterval} from '@widgets/chart/config/chartInterval';
import {defaultChartPeriod} from '@widgets/chart/config/chartPeriod';
import {defaultChartView} from '@widgets/chart/config/chartView';
import {fetchChartData} from '@widgets/chart/lib/fetchChartData';
import {
  buildChartDataCacheKey,
  fetchCachedChartData,
  getCachedChartData,
} from '@widgets/chart/model/chartDataCache';

const warmChartGraphModule = () =>
  import('@widgets/chart/ui/ChartGraphSection');

export const prefetchDefaultChart = async (isAuthorized: boolean) => {
  const [, assets] = await Promise.all([
    warmChartGraphModule(),
    fetchAssetsList(EassetTypes.STOCK, isAuthorized),
  ]);
  const firstAsset = assets.available[0];

  if (!firstAsset) {
    return;
  }

  const cacheKey = buildChartDataCacheKey({
    view: defaultChartView,
    selectedAssetId: String(firstAsset.id),
    interval: defaultChartInterval,
    period: defaultChartPeriod,
    isFiz: false,
    isAuthorized,
  });

  if (getCachedChartData(cacheKey)) {
    return;
  }

  await fetchCachedChartData(cacheKey, () =>
    fetchChartData({
      view: defaultChartView,
      selectedAssetId: String(firstAsset.id),
      interval: defaultChartInterval,
      period: defaultChartPeriod,
      isFiz: false,
    }),
  );
};
