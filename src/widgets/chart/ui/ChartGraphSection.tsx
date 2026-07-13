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
import {ChartPriceOverlay} from './ChartPriceOverlay';
import {ChartShowPriceButton} from './ChartShowPriceButton';

type ChartGraphSectionProps = {
  view: ChartViewId;
  metric: ChartMetricId;
  isFiz: boolean;
  interval: ChartIntervalId;
  period: ChartPeriodId;
  selectedAsset?: Asset;
  resolvedSelectedAssetId: string | null;
  chartWidth?: number;
  chartHeight?: number;
  showPrice?: boolean;
  onTogglePrice?: () => void;
  dense?: boolean;
  hideLegend?: boolean;
  fill?: boolean;
};

export const ChartGraphSection = ({
  view,
  metric,
  isFiz,
  interval,
  period,
  selectedAsset,
  resolvedSelectedAssetId,
  chartWidth = 0,
  chartHeight = 0,
  showPrice = true,
  onTogglePrice,
  dense = false,
  hideLegend = false,
  fill = false,
}: ChartGraphSectionProps) => {
  const [isLandscapeMode, setIsLandscapeMode] = useState(false);

  const canTogglePrice =
    (view === 'buy-sell' || view === 'buyers-sellers') && !!onTogglePrice;

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
        showPrice,
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
      showPrice,
    ],
  );

  const showSpinner = isLoadingAssets && !chartViewModel.hasChartData;

  const priceToggle =
    canTogglePrice && !dense ? (
      <ChartShowPriceButton
        showPrice={chartViewModel.showPrice}
        onToggle={onTogglePrice}
        compact
      />
    ) : null;

  const landscapeButton =
    !showSpinner && chartViewModel.hasChartData && !dense ? (
      <Pressable
        onPress={() => setIsLandscapeMode(true)}
        accessibilityRole="button"
        accessibilityLabel="Открыть график в альбомном режиме"
        className="h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#21262d] bg-[#0F1115]/95">
        <RectangleHorizontal size={16} color="#8b949e" />
      </Pressable>
    ) : null;

  const overlayActions =
    priceToggle || landscapeButton ? (
      <View className="flex-row items-center gap-1.5">
        {priceToggle}
        {landscapeButton}
      </View>
    ) : undefined;

  return (
    <View className={fill ? 'min-h-0 flex-1' : dense ? 'gap-1.5' : 'gap-2.5'}>
      <ChartCanvas
        chartKey={chartViewModel.chartKey}
        chartData={chartViewModel.chartData}
        width={chartWidth}
        height={chartHeight}
        showSpinner={showSpinner}
        compactFrame={!fill}
        fill={fill}
        variant={fill ? 'fullBleed' : 'default'}
        compactGutters={fill || dense}
        overlay={
          <View className="absolute inset-x-0 top-0 z-10 px-0.5 pt-0.5">
            <ChartPriceOverlay
              stats={chartViewModel.assetStats}
              dense={dense || fill}
              action={overlayActions}
            />
          </View>
        }
      />

      {!dense && !fill ? (
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
          showPrice={chartViewModel.showPrice}
        />
      ) : null}

      {!hideLegend ? (
        <ChartLegend
          view={view}
          legalSeries={chartViewModel.legalSeries}
          priceColor={chartViewModel.priceColor}
          latestPrice={chartViewModel.assetStats.latestPrice}
          latestSignalValue={chartViewModel.latestSignalValue}
          signalThresholds={chartViewModel.signalThresholds}
          metric={metric}
          isFiz={isFiz}
          showPrice={chartViewModel.showPrice}
          variant={dense ? 'compact' : 'default'}
        />
      ) : null}
    </View>
  );
};
