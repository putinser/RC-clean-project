import {lazy, Suspense, useEffect, useState} from 'react';
import {ScrollView, View, useWindowDimensions} from 'react-native';
import {useUserStore} from '@entities/user';
import {isTabletLayout} from '@shared/lib/deviceLayout';
import {type AssetTypeId, EassetTypes} from '../config/assetTypes';
import {chartViewOptions} from '../config/chartView';
import {type ChartPeriodId, defaultChartPeriod} from '../config/chartPeriod';
import {entityTypeOptions} from '../config/entityType';
import {getIntervalOptions, getPeriodOptions} from '../lib/chartFilters';
import {ensureChartDataLoaded} from '../model/ensureChartDataLoaded';
import {useAssetsList} from '../model/useAssetsList';
import {useChartControls} from '../model/useChartControls';
import {ChartAssetList} from './ChartAssetList';
import {ChartGraphPlaceholder} from './ChartGraphPlaceholder';
import {ChartInterval} from './ChartInterval';
import {ChartSelect, MetricSelect} from './ChartSelect';

const ChartGraphSection = lazy(() =>
  import('./ChartGraphSection').then((module) => ({
    default: module.ChartGraphSection,
  })),
);

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
  const [isGraphReady, setIsGraphReady] = useState(false);
  const isAuthorized = useUserStore((state) => state.isAuthorized);

  const {
    availableAssets,
    unavailableAssets,
    isLoading,
    selectedAsset,
    resolvedSelectedAssetId,
  } = useAssetsList(assetType, selectedAssetId);

  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      setIsGraphReady(true);
    });

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, []);

  useEffect(() => {
    ensureChartDataLoaded({
      view,
      resolvedSelectedAssetId,
      interval,
      period,
      isFiz,
      isAuthorized,
    }).catch(() => {});
  }, [
    view,
    resolvedSelectedAssetId,
    interval,
    period,
    isFiz,
    isAuthorized,
  ]);

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

  const graphPlaceholder = (
    <ChartGraphPlaceholder width={chartWidth} height={chartHeight} />
  );

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

      {isGraphReady ? (
        <Suspense fallback={graphPlaceholder}>
          <ChartGraphSection
            view={view}
            metric={metric}
            isFiz={isFiz}
            interval={interval}
            period={period}
            selectedAsset={selectedAsset}
            resolvedSelectedAssetId={resolvedSelectedAssetId}
            chartWidth={chartWidth}
            chartHeight={chartHeight}
          />
        </Suspense>
      ) : (
        graphPlaceholder
      )}

      <View
        className="overflow-hidden rounded-2xl border border-[#21262d] bg-[#0F1115] px-2 py-3"
        style={{height: 260}}>
        <ChartAssetList
          assetType={assetType}
          onAssetTypeChange={setAssetType}
          availableAssets={availableAssets}
          unavailableAssets={unavailableAssets}
          isLoading={isLoading}
          selectedAssetId={resolvedSelectedAssetId}
          onAssetSelect={setSelectedAssetId}
        />
      </View>
    </ScrollView>
  );
};
