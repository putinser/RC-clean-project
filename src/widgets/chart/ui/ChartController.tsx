import {useEffect, useMemo, useState} from 'react';
import {Pressable, ScrollView, View, useWindowDimensions} from 'react-native';
import {RectangleHorizontal} from 'lucide-react-native';
import {isTabletLayout} from '@shared/lib/deviceLayout';
import {type AssetTypeId, EassetTypes} from '../config/assetTypes';
import {chartViewOptions} from '../config/chartView';
import {type ChartPeriodId, defaultChartPeriod} from '../config/chartPeriod';
import {entityTypeOptions} from '../config/entityType';
import {getIntervalOptions, getPeriodOptions} from '../lib/chartFilters';
import {getChartViewModel} from '../lib/getChartViewModel';
import {useAssets} from '../model/useAssets';
import {useChartControls} from '../model/useChartControls';
import {ChartAssetList} from './ChartAssetList';
import {ChartCanvas} from './ChartCanvas';
import {ChartInterval} from './ChartInterval';
import {ChartLegend} from './ChartLegend';
import {ChartSelect, MetricSelect} from './ChartSelect';
import {ChartStatsOverlay} from './ChartStatsOverlay';
import {ChartLandscapeModal} from './ChartLandscapeModal';

const CHART_SCREEN_INSET = 16;
const CHART_FRAME_HORIZONTAL_PADDING = 4;

export const ChartController = () => {
  const {
    interval,
    handleInterval,
    view,
    changeView,
    metric,
    changeMetric,
    metricOptions,
  } = useChartControls();

  const [assetType, setAssetType] = useState<AssetTypeId>(EassetTypes.STOCK);
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [period, setPeriod] = useState<ChartPeriodId>(defaultChartPeriod);
  const [isFiz, setIsFiz] = useState<boolean>(false);
  const [isLandscapeMode, setIsLandscapeMode] = useState(false);

  const {
    availableAssets,
    unavailableAssets,
    isLoading,
    assetsLegal,
    assetsPrice,
    assetsRsi,
    assetsPriceReport,
    selectedAsset,
    isLoadingAssets,
  } = useAssets(
    assetType,
    view,
    selectedAssetId,
    interval,
    period,
    isFiz,
  );

  useEffect(() => {
    if (!selectedAssetId && availableAssets.length > 0) {
      setSelectedAssetId(String(availableAssets[0].id));
    }
  }, [availableAssets, selectedAssetId]);

  const isOnline = selectedAsset?.isOnline ?? true;
  const intervalOptions = getIntervalOptions(isOnline, view, period);
  const periodOptions = getPeriodOptions(isOnline, view);

  useEffect(() => {
    if (
      intervalOptions.length > 0 &&
      !intervalOptions.some((opt) => opt.id === interval)
    ) {
      handleInterval(intervalOptions[0].id);
    }
  }, [intervalOptions, interval, handleInterval]);

  useEffect(() => {
    if (
      periodOptions.length > 0 &&
      !periodOptions.some((opt) => opt.id === period)
    ) {
      setPeriod(periodOptions[0].id);
    }
  }, [periodOptions, period]);

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

  const {width: screenWidth, height: screenHeight} = useWindowDimensions();
  const isTablet = isTabletLayout(screenWidth, screenHeight);
  const TABLET_CHART_SCREEN_INSET = isTablet ? 20 : CHART_SCREEN_INSET;
  const chartWidth = Math.max(
    screenWidth - TABLET_CHART_SCREEN_INSET * 2 - CHART_FRAME_HORIZONTAL_PADDING * 2,
    280,
  );
  const chartHeight = isTablet
    ? Math.max(Math.round(Math.min(screenHeight * 0.55, 650)), 380)
    : Math.max(Math.round(Math.min(screenHeight * 0.50, 520)), 260);

  const showSpinner = isLoadingAssets || !chartViewModel.hasChartData;

  return (
    <ScrollView
      className="bg-background"
      contentContainerClassName="gap-3 px-4 py-3 pb-28"
      showsVerticalScrollIndicator={false}>
      <View className="gap-3 rounded-2xl border border-[#464B52] bg-[#0F1115] p-3">
        {view !== 'asset-price' ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <ChartInterval
              interval={interval}
              handleInterval={handleInterval}
              options={intervalOptions}
            />
          </ScrollView>
        ) : null}

        <View className="gap-2">
          <View className="flex-row gap-2">
            <View className="min-w-0 flex-1">
              <ChartSelect
                options={chartViewOptions}
                value={view}
                onChange={changeView}
                ariaLabel="Вид графика"
              />
            </View>
            <View className="min-w-0 flex-1">
              <ChartSelect
                options={periodOptions.map((opt) => ({
                  id: opt.id,
                  label1: opt.label,
                }))}
                value={period}
                onChange={(val) => setPeriod(val as ChartPeriodId)}
                ariaLabel="Период"
              />
            </View>
          </View>

          <View key={view} className="flex-row gap-2">
            {metricOptions ? (
              <View className="min-w-0 flex-1">
                <MetricSelect
                  options={metricOptions}
                  value={metric}
                  onChange={changeMetric}
                />
              </View>
            ) : null}
            <View className="min-w-0 flex-1">
              <ChartSelect
                options={entityTypeOptions}
                value={isFiz ? 'true' : 'false'}
                onChange={(val) => setIsFiz(val === 'true')}
                ariaLabel="Тип лица"
              />
            </View>
          </View>
        </View>
      </View>

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

      <View
        className="overflow-hidden rounded-2xl border border-[#21262d] bg-[#0F1115] px-2 py-3"
        style={{height: 260}}>
        <ChartAssetList
          assetType={assetType}
          onAssetTypeChange={setAssetType}
          availableAssets={availableAssets}
          unavailableAssets={unavailableAssets}
          isLoading={isLoading}
          selectedAssetId={selectedAssetId}
          onAssetSelect={setSelectedAssetId}
        />
      </View>
    </ScrollView>
  );
};
