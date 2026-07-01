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
}: Omit<ChartViewProps, 'isLoading'>): ChartViewModel => {
  const built = buildSkiaChartData({
    assetsLegal,
    assetsPrice,
    assetsRsi,
    assetsPriceReport,
    selectedAsset,
    view,
    metric,
    isFiz,
  });

  const latestValue =
    built.latestPrice ?? selectedAsset?.price?.value ?? undefined;

  return {
    chartKey: `${view}-${view === 'signals' || view === 'asset-price' ? (isFiz ? 'fiz' : 'yur') : metric}`,
    chartData: built.chartData,
    legalSeries: built.legalSeries,
    priceColor: built.priceColor,
    assetStats: getChartAssetStats(selectedAsset, latestValue),
    hasChartData: built.chartData.series.some((series) => series.points.length > 0),
    latestSignalValue: built.latestRsi,
    signalThresholds: built.signalThresholds,
  };
};
