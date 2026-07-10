import {useEffect, useLayoutEffect, useMemo, useState} from 'react';
import {useUserStore} from '@entities/user';
import type {AssetItem, PriceReportItem, RsiReportItem} from '@services/assets/types';
import type {ChartIntervalId} from '../config/chartInterval';
import type {ChartPeriodId} from '../config/chartPeriod';
import {type ChartViewId, getChartDataMode} from '../config/chartView';
import {fetchChartData} from '../lib/fetchChartData';
import {
  applyChartData,
  clearChartData,
} from './chartDataState';
import {
  buildChartDataCacheKey,
  fetchCachedChartData,
  getCachedChartData,
} from './chartDataCache';

export const useChartData = (
  view: ChartViewId,
  resolvedSelectedAssetId: string | null,
  interval: ChartIntervalId,
  period: ChartPeriodId,
  isFiz: boolean,
) => {
  const isAuthorized = useUserStore((state) => state.isAuthorized);
  const chartDataMode = getChartDataMode(view);

  const [assetsLegal, setAssetsLegal] = useState<AssetItem[]>([]);
  const [assetsPrice, setAssetsPrice] = useState<AssetItem[]>([]);
  const [assetsRsi, setAssetsRsi] = useState<RsiReportItem[]>([]);
  const [assetsPriceReport, setAssetsPriceReport] = useState<PriceReportItem[]>(
    [],
  );

  const chartDataCacheKey = useMemo(() => {
    if (!chartDataMode || !resolvedSelectedAssetId) {
      return null;
    }
    return buildChartDataCacheKey({
      view,
      selectedAssetId: resolvedSelectedAssetId,
      interval,
      period,
      isFiz,
      isAuthorized,
    });
  }, [
    chartDataMode,
    resolvedSelectedAssetId,
    view,
    interval,
    period,
    isFiz,
    isAuthorized,
  ]);

  const [isLoadingAssets, setIsLoadingAssets] = useState(() => {
    if (!chartDataCacheKey) {
      return false;
    }
    return !getCachedChartData(chartDataCacheKey);
  });

  const chartDataSetters = {
    setAssetsLegal,
    setAssetsPrice,
    setAssetsRsi,
    setAssetsPriceReport,
  };

  useLayoutEffect(() => {
    if (!chartDataCacheKey) {
      return;
    }

    const cached = getCachedChartData(chartDataCacheKey);
    if (!cached) {
      return;
    }

    applyChartData(cached, chartDataSetters);
    setIsLoadingAssets(false);
  }, [chartDataCacheKey]);

  useEffect(() => {
    let isCancelled = false;

    const loadChartData = async () => {
      if (!chartDataMode || !resolvedSelectedAssetId || !chartDataCacheKey) {
        clearChartData(chartDataSetters);
        setIsLoadingAssets(false);
        return;
      }

      const cached = getCachedChartData(chartDataCacheKey);
      if (cached) {
        applyChartData(cached, chartDataSetters);
        setIsLoadingAssets(false);
      } else {
        setIsLoadingAssets(true);
      }

      try {
        const data = await fetchCachedChartData(chartDataCacheKey, () =>
          fetchChartData({
            view,
            selectedAssetId: resolvedSelectedAssetId,
            interval,
            period,
            isFiz,
          }),
        );

        if (!isCancelled) {
          applyChartData(data, chartDataSetters);
          setIsLoadingAssets(false);
        }
      } catch (error) {
        console.error('Failed to fetch chart data:', error);
        if (!isCancelled) {
          if (!cached) {
            clearChartData(chartDataSetters);
          }
          setIsLoadingAssets(false);
        }
      }
    };

    loadChartData();

    return () => {
      isCancelled = true;
    };
  }, [
    chartDataCacheKey,
    chartDataMode,
    resolvedSelectedAssetId,
    view,
    interval,
    period,
    isFiz,
  ]);

  return {
    assetsLegal,
    assetsPrice,
    assetsRsi,
    assetsPriceReport,
    isLoadingAssets,
  };
};
