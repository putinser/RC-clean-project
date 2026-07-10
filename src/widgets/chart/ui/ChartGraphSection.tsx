import {useMemo, useState} from 'react';
import {Pressable, View} from 'react-native';
import {RectangleHorizontal} from 'lucide-react-native';
import type {Asset} from '@services/assets/types';
import type {ChartMetricId} from '../config/chartMetric';
import type {ChartIntervalId} from '../config/chartInterval';
import type {ChartPeriodId} from '../config/chartPeriod';
import type {ChartViewId} from '../config/chartView';
import {getChartViewModel} from '../lib/getChartViewModel';
import {useChartData} from '../model/useChartData';
import {ChartCanvas} from './ChartCanvas';
import {ChartLandscapeModal} from './ChartLandscapeModal';
import {ChartLegend} from './ChartLegend';
import {ChartStatsOverlay} from './ChartStatsOverlay';

type ChartGraphSectionProps = {
  view: ChartViewId;
  metric: ChartMetricId;
  isFiz: boolean;
  interval: ChartIntervalId;
  period: ChartPeriodId;
  selectedAsset?: Asset;
  resolvedSelectedAssetId: string | null;
  chartWidth: number;
  chartHeight: number;
};

export const ChartGraphSection = ({
  view,
  metric,
  isFiz,
  interval,
  period,
  selectedAsset,
  resolvedSelectedAssetId,
  chartWidth,
  chartHeight,
}: ChartGraphSectionProps) => {
  const [isLandscapeMode, setIsLandscapeMode] = useState(false);

  const {
    assetsLegal,
    assetsPrice,
    assetsRsi,
    assetsPriceReport,
    isLoadingAssets,
  } = useChartData(view, resolvedSelectedAssetId, interval, period, isFiz);

  const chartViewModel = useMemo(
    () =>
      getChartViewModel({
        assetsLegal,
        assetsPrice,
        assetsRsi,
        assetsPriceReport,
        selectedAsset,
        view,
        metric,
        isFiz,
      }),
    [
      assetsLegal,
      assetsPrice,
      assetsRsi,
      assetsPriceReport,
      selectedAsset,
      view,
      metric,
      isFiz,
    ],
  );

  const showSpinner = isLoadingAssets && !chartViewModel.hasChartData;

  return (
    <View className="gap-2.5">
      <ChartCanvas
        chartKey={chartViewModel.chartKey}
        chartData={chartViewModel.chartData}
        width={chartWidth}
        height={chartHeight}
        showSpinner={showSpinner}
        compactFrame
        overlay={
          <View className="absolute inset-x-0 top-0 z-10 flex-row items-start justify-between gap-2">
            <View className="flex-1 shrink">
              <ChartStatsOverlay stats={chartViewModel.assetStats} />
            </View>
            {!showSpinner && chartViewModel.hasChartData ? (
              <Pressable
                onPress={() => setIsLandscapeMode(true)}
                accessibilityRole="button"
                accessibilityLabel="Открыть график в альбомном режиме"
                className="mt-0.5 h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#21262d] bg-[#0F1115]/95">
                <RectangleHorizontal size={16} color="#8b949e" />
              </Pressable>
            ) : null}
          </View>
        }
      />

      <ChartLandscapeModal
        visible={isLandscapeMode}
        onClose={() => setIsLandscapeMode(false)}
        chartKey={chartViewModel.chartKey}
        chartData={chartViewModel.chartData}
        showSpinner={showSpinner}
        assetStats={chartViewModel.assetStats}
        view={view}
        legalSeries={chartViewModel.legalSeries}
        priceColor={chartViewModel.priceColor}
        latestSignalValue={chartViewModel.latestSignalValue}
        signalThresholds={chartViewModel.signalThresholds}
        metric={metric}
        isFiz={isFiz}
      />

      <ChartLegend
        view={view}
        legalSeries={chartViewModel.legalSeries}
        priceColor={chartViewModel.priceColor}
        latestPrice={chartViewModel.assetStats.latestPrice}
        latestSignalValue={chartViewModel.latestSignalValue}
        signalThresholds={chartViewModel.signalThresholds}
        metric={metric}
        isFiz={isFiz}
      />
    </View>
  );
};
