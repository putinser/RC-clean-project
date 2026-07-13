import {lazy, Suspense, useCallback, useEffect, useState} from 'react';
import {ScrollView, View, useWindowDimensions} from 'react-native';
import {useUserStore} from '@entities/user';
import {isTabletLayout} from '@shared/lib/deviceLayout';
import {type AssetTypeId, EassetTypes} from '../config/assetTypes';
import {
  type ChartLayoutId,
  defaultChartLayout,
  getChartLayoutPanelCount,
  resolveLayoutAfterRemove,
} from '../config/chartLayout';
import {
  defaultChartMetric,
  getMetricOptions,
} from '../config/chartMetric';
import {type ChartPeriodId, defaultChartPeriod} from '../config/chartPeriod';
import {chartViewOptions} from '../config/chartView';
import {entityTypeOptions} from '../config/entityType';
import {getIntervalOptions, getPeriodOptions} from '../lib/chartFilters';
import {
  type ChartPanelState,
  createChartPanelState,
} from '../lib/chartPanel';
import {ensureChartDataLoaded} from '../model/ensureChartDataLoaded';
import {useAssetsList} from '../model/useAssetsList';
import {ChartAssetList} from './ChartAssetList';
import {ChartGraphPlaceholder} from './ChartGraphPlaceholder';
import {ChartInterval} from './ChartInterval';
import {ChartLayoutSelect} from './ChartLayoutSelect';
import {ChartSelect, MetricSelect} from './ChartSelect';
import {ChartVerticalSplitModal} from './ChartVerticalSplitModal';

const ChartPanel = lazy(() =>
  import('./ChartPanel').then((module) => ({
    default: module.ChartPanel,
  })),
);

const CHART_SCREEN_INSET = 16;
const CHART_FRAME_HORIZONTAL_PADDING = 4;

export const ChartController = () => {
  const [layout, setLayout] = useState<ChartLayoutId>(defaultChartLayout);
  const [activePanelIndex, setActivePanelIndex] = useState(0);
  const [panels, setPanels] = useState<ChartPanelState[]>(() => [
    createChartPanelState({
      assetType: EassetTypes.STOCK,
      selectedAssetId: null,
    }),
  ]);
  const [isGraphReady, setIsGraphReady] = useState(false);
  const isAuthorized = useUserStore((state) => state.isAuthorized);

  const activePanel = panels[activePanelIndex] ?? panels[0];
  const dense = layout !== 'single';
  const metricOptions = getMetricOptions(activePanel.view);

  const updatePanel = useCallback(
    (index: number, patch: Partial<ChartPanelState>) => {
      setPanels((prev) =>
        prev.map((panel, panelIndex) =>
          panelIndex === index ? {...panel, ...patch} : panel,
        ),
      );
    },
    [],
  );

  const updateActivePanel = useCallback(
    (patch: Partial<ChartPanelState>) => {
      updatePanel(activePanelIndex, patch);
    },
    [activePanelIndex, updatePanel],
  );

  const {
    availableAssets,
    unavailableAssets,
    isLoading,
    selectedAsset,
    resolvedSelectedAssetId,
  } = useAssetsList(activePanel.assetType, activePanel.selectedAssetId);

  useEffect(() => {
    if (!activePanel.selectedAssetId && resolvedSelectedAssetId) {
      updateActivePanel({selectedAssetId: resolvedSelectedAssetId});
    }
  }, [
    activePanel.selectedAssetId,
    resolvedSelectedAssetId,
    updateActivePanel,
  ]);

  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      setIsGraphReady(true);
    });

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, []);

  useEffect(() => {
    panels.forEach((panel) => {
      ensureChartDataLoaded({
        view: panel.view,
        resolvedSelectedAssetId: panel.selectedAssetId,
        interval: panel.interval,
        period: panel.period,
        isFiz: panel.isFiz,
        isAuthorized,
      }).catch(() => {});
    });
  }, [panels, isAuthorized]);

  const isOnline = selectedAsset?.isOnline ?? true;
  const intervalOptions = getIntervalOptions(
    isOnline,
    activePanel.view,
    activePanel.period,
  );
  const periodOptions = getPeriodOptions(isOnline, activePanel.view);

  useEffect(() => {
    if (
      intervalOptions.length > 0 &&
      !intervalOptions.some((opt) => opt.id === activePanel.interval)
    ) {
      updateActivePanel({interval: intervalOptions[0].id});
    }
  }, [intervalOptions, activePanel.interval, updateActivePanel]);

  useEffect(() => {
    if (
      periodOptions.length > 0 &&
      !periodOptions.some((opt) => opt.id === activePanel.period)
    ) {
      updateActivePanel({period: periodOptions[0].id});
    }
  }, [periodOptions, activePanel.period, updateActivePanel]);

  const handleLayoutChange = (nextLayout: ChartLayoutId) => {
    const nextCount = getChartLayoutPanelCount(nextLayout);

    setPanels((prev) => {
      if (prev.length === nextCount) {
        return prev;
      }
      if (prev.length > nextCount) {
        return prev.slice(0, nextCount);
      }

      const template = prev[activePanelIndex] ?? prev[0];
      const added = Array.from({length: nextCount - prev.length}, () =>
        createChartPanelState({
          assetType: template.assetType,
          view: template.view,
          metric: template.metric,
          interval: template.interval,
          period: template.period,
          isFiz: template.isFiz,
          showPrice: template.showPrice,
          selectedAssetId: null,
        }),
      );

      return [...prev, ...added];
    });

    setLayout(nextLayout);
    setActivePanelIndex((prev) => Math.min(prev, nextCount - 1));
  };

  const handleClosePanel = (index: number) => {
    if (panels.length <= 1) {
      return;
    }

    const nextLayout = resolveLayoutAfterRemove(layout);
    const nextCount = getChartLayoutPanelCount(nextLayout);

    setPanels((prev) => {
      const remaining = prev.filter((_, panelIndex) => panelIndex !== index);
      if (remaining.length === nextCount) {
        return remaining;
      }
      return remaining.slice(0, nextCount);
    });
    setLayout(nextLayout);
    setActivePanelIndex((prev) => {
      if (index < prev) {
        return prev - 1;
      }
      if (index === prev) {
        return Math.max(0, prev - 1);
      }
      return Math.min(prev, nextCount - 1);
    });
  };

  const {width: screenWidth, height: screenHeight} = useWindowDimensions();
  const isTablet = isTabletLayout(screenWidth, screenHeight);
  const TABLET_CHART_SCREEN_INSET = isTablet ? 20 : CHART_SCREEN_INSET;
  const chartWidth = Math.max(
    screenWidth -
      TABLET_CHART_SCREEN_INSET * 2 -
      CHART_FRAME_HORIZONTAL_PADDING * 2,
    280,
  );
  const singleChartHeight = isTablet
    ? Math.max(Math.round(Math.min(screenHeight * 0.55, 650)), 380)
    : Math.max(Math.round(Math.min(screenHeight * 0.5, 520)), 260);

  const isVerticalSplit = layout === 'vertical';
  const showPortraitPanels = !isVerticalSplit;
  const panelChartWidth = chartWidth - (dense && !isVerticalSplit ? 12 : 0);
  const panelChartHeight =
    dense && !isVerticalSplit
      ? Math.max(Math.round(singleChartHeight * 0.48), isTablet ? 220 : 180)
      : singleChartHeight;

  const graphPlaceholder = (
    <ChartGraphPlaceholder width={chartWidth} height={singleChartHeight} />
  );

  return (
    <ScrollView
      className="bg-background"
      contentContainerClassName="gap-3 px-4 py-3 pb-28"
      showsVerticalScrollIndicator={false}>
      <View className="gap-3 rounded-2xl border border-[#464B52] bg-[#0F1115] p-3">
        <View className="flex-row items-center gap-2">
          {activePanel.view !== 'asset-price' ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="min-w-0 flex-1">
              <ChartInterval
                interval={activePanel.interval}
                handleInterval={(interval) => updateActivePanel({interval})}
                options={intervalOptions}
              />
            </ScrollView>
          ) : (
            <View className="min-w-0 flex-1" />
          )}
          <ChartLayoutSelect value={layout} onChange={handleLayoutChange} />
        </View>

        <View className="gap-2">
          <View className="flex-row gap-2">
            <View className="min-w-0 flex-1">
              <ChartSelect
                options={chartViewOptions}
                value={activePanel.view}
                onChange={(val) =>
                  updateActivePanel({
                    view: val as ChartPanelState['view'],
                    metric: defaultChartMetric,
                  })
                }
                ariaLabel="Вид графика"
              />
            </View>
            <View className="min-w-0 flex-1">
              <ChartSelect
                options={periodOptions.map((opt) => ({
                  id: opt.id,
                  label1: opt.label,
                }))}
                value={activePanel.period}
                onChange={(val) =>
                  updateActivePanel({period: val as ChartPeriodId})
                }
                ariaLabel="Период"
              />
            </View>
          </View>

          <View key={activePanel.view} className="flex-row gap-2">
            {metricOptions ? (
              <View className="min-w-0 flex-1">
                <MetricSelect
                  options={metricOptions}
                  value={activePanel.metric}
                  onChange={(val) =>
                    updateActivePanel({
                      metric: val as ChartPanelState['metric'],
                    })
                  }
                />
              </View>
            ) : null}
            <View className="min-w-0 flex-1">
              <ChartSelect
                options={entityTypeOptions}
                value={activePanel.isFiz ? 'true' : 'false'}
                onChange={(val) => updateActivePanel({isFiz: val === 'true'})}
                ariaLabel="Тип лица"
              />
            </View>
          </View>
        </View>
      </View>

      {isGraphReady && showPortraitPanels ? (
        <Suspense fallback={graphPlaceholder}>
          <View className={dense ? 'gap-2' : undefined}>
            {panels.map((panel, index) => (
              <View key={panel.id}>
                <ChartPanel
                  state={panel}
                  onChange={(patch) => updatePanel(index, patch)}
                  isActive={activePanelIndex === index}
                  dense={dense}
                  onActivate={() => setActivePanelIndex(index)}
                  onClose={dense ? () => handleClosePanel(index) : undefined}
                  chartWidth={panelChartWidth}
                  chartHeight={panelChartHeight}
                />
              </View>
            ))}
          </View>
        </Suspense>
      ) : !isVerticalSplit ? (
        graphPlaceholder
      ) : null}

      <ChartVerticalSplitModal
        visible={isVerticalSplit}
        panels={panels}
        activePanelIndex={activePanelIndex}
        layout={layout}
        isOnline={isOnline}
        onActivatePanel={setActivePanelIndex}
        onChangePanel={updatePanel}
        onClosePanel={handleClosePanel}
        onLayoutChange={handleLayoutChange}
        onClose={() => handleLayoutChange('single')}
      />

      {!dense ? (
        <View
          className="overflow-hidden rounded-2xl border border-[#21262d] bg-[#0F1115] px-2 py-3"
          style={{height: 260}}>
          <ChartAssetList
            assetType={activePanel.assetType}
            onAssetTypeChange={(assetType: AssetTypeId) =>
              updateActivePanel({assetType, selectedAssetId: null})
            }
            availableAssets={availableAssets}
            unavailableAssets={unavailableAssets}
            isLoading={isLoading}
            selectedAssetId={resolvedSelectedAssetId}
            onAssetSelect={(selectedAssetId) =>
              updateActivePanel({selectedAssetId})
            }
          />
        </View>
      ) : null}
    </ScrollView>
  );
};
