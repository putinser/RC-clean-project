import {getChartAssetStats} from './chartAssetStats';
import {buildSkiaChartData} from './buildSkiaChartData';
import type {ChartViewProps, ChartViewModel} from './chartView.types';

export const getChartViewModel = ({
  assetsLegal,
  assetsPrice,
  assetsRsi,
  assetsPriceReport,
  selectedAsset,
  view,
  metric,
  isFiz = false,
  showPrice = true,
}: Omit<ChartViewProps, 'isLoading'> & {showPrice?: boolean}): ChartViewModel => {
  const canTogglePrice = view === 'buy-sell' || view === 'buyers-sellers';
  const effectiveShowPrice = canTogglePrice ? showPrice : true;

  const built = buildSkiaChartData({
    assetsLegal,
    assetsPrice,
    assetsRsi,
    assetsPriceReport,
    selectedAsset,
    view,
    metric,
    isFiz,
    showPrice: effectiveShowPrice,
  });

  const latestValue =
    built.latestPrice ?? selectedAsset?.price?.value ?? undefined;

  const chartKeyBase =
    view === 'signals' || view === 'asset-price'
      ? `${view}-${isFiz ? 'fiz' : 'yur'}`
      : `${view}-${metric}-${effectiveShowPrice ? 'price' : 'solo'}`;

  return {
    chartKey: chartKeyBase,
    chartData: built.chartData,
    legalSeries: built.legalSeries,
    priceColor: built.priceColor,
    assetStats: getChartAssetStats(selectedAsset, latestValue),
    hasChartData: built.chartData.series.some((series) => series.points.length > 0),
    latestSignalValue: built.latestRsi,
    signalThresholds: built.signalThresholds,
    showPrice: effectiveShowPrice,
  };
};
