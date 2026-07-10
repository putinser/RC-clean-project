import {serviceAssets} from '@services/assets';
import type {GetAssetsParams} from '@services/assets/types';
import type {ChartIntervalId} from '../config/chartInterval';
import type {ChartPeriodId} from '../config/chartPeriod';
import {
  getChartDataMode,
  getChartPositionFetcher,
  getChartPriceReportFetcher,
  getChartPriceReportType,
  getChartRsiFetcher,
  type ChartViewId,
} from '../config/chartView';
import {getApiParams} from '../lib/chartFilters';
import type {ChartDataCacheEntry} from '../model/chartDataCache';

const emptyChartData = (): ChartDataCacheEntry => ({
  assetsLegal: [],
  assetsPrice: [],
  assetsRsi: [],
  assetsPriceReport: [],
});

export type FetchChartDataParams = {
  view: ChartViewId;
  selectedAssetId: string;
  interval: ChartIntervalId;
  period: ChartPeriodId;
  isFiz: boolean;
};

export const fetchChartData = async ({
  view,
  selectedAssetId,
  interval,
  period,
  isFiz,
}: FetchChartDataParams): Promise<ChartDataCacheEntry> => {
  const chartDataMode = getChartDataMode(view);
  const fetchPosition = getChartPositionFetcher(view);
  const fetchRsi = getChartRsiFetcher(view);
  const fetchPriceReport = getChartPriceReportFetcher(view);
  const priceReportType = getChartPriceReportType(view);

  if (!chartDataMode) {
    return emptyChartData();
  }

  const {
    from,
    to,
    interval: apiInterval,
    type: apiType,
  } = getApiParams(interval, period);

  const baseParams: GetAssetsParams = {
    from,
    to,
    interval: apiInterval,
    type: apiType,
    iz_fiz: isFiz,
    id: Number(selectedAssetId),
  };

  if (chartDataMode === 'position' && fetchPosition) {
    const priceParams: GetAssetsParams = {
      ...baseParams,
      additional_report_type: priceReportType,
    };
    const [positionAssets, priceAssets] = await Promise.all([
      fetchPosition(baseParams),
      serviceAssets.getAssetsPrice(priceParams),
    ]);

    return {
      assetsLegal: positionAssets,
      assetsPrice: priceAssets,
      assetsRsi: [],
      assetsPriceReport: [],
    };
  }

  if (chartDataMode === 'rsi' && fetchRsi) {
    const rsiAssets = await fetchRsi(baseParams);

    return {
      assetsLegal: [],
      assetsPrice: [],
      assetsRsi: rsiAssets,
      assetsPriceReport: [],
    };
  }

  if (chartDataMode === 'price-only' && fetchPriceReport) {
    const priceReportAssets = await fetchPriceReport(baseParams);

    return {
      assetsLegal: [],
      assetsPrice: [],
      assetsRsi: [],
      assetsPriceReport: priceReportAssets,
    };
  }

  return emptyChartData();
};
