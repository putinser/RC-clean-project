import {useEffect, useRef} from 'react';
import {View} from 'react-native';
import {cn} from '@shared/lib/cn';
import type {ChartPanelState} from '../lib/chartPanel';
import {useAssetsList} from '../model/useAssetsList';
import {ChartGraphSection} from './ChartGraphSection';
import {ChartPanelCompactHeader} from './ChartPanelCompactHeader';

type ChartPanelProps = {
  state: ChartPanelState;
  onChange: (patch: Partial<ChartPanelState>) => void;
  isActive: boolean;
  dense: boolean;
  onActivate: () => void;
  onClose?: () => void;
  chartWidth?: number;
  chartHeight?: number;
  hideLegend?: boolean;
  fill?: boolean;
};

export const ChartPanel = ({
  state,
  onChange,
  isActive,
  dense,
  onActivate,
  onClose,
  chartWidth = 0,
  chartHeight = 0,
  hideLegend = false,
  fill = false,
}: ChartPanelProps) => {
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const {
    availableAssets,
    unavailableAssets,
    isLoading,
    selectedAsset,
    resolvedSelectedAssetId,
  } = useAssetsList(state.assetType, state.selectedAssetId);

  useEffect(() => {
    if (!state.selectedAssetId && resolvedSelectedAssetId) {
      onChangeRef.current({selectedAssetId: resolvedSelectedAssetId});
    }
  }, [resolvedSelectedAssetId, state.selectedAssetId]);

  const canTogglePrice =
    state.view === 'buy-sell' || state.view === 'buyers-sellers';

  return (
    <View
      onTouchStart={onActivate}
      className={cn(
        'overflow-hidden rounded-2xl',
        fill && 'min-h-0 flex-1',
        dense
          ? cn(
              'border bg-[#0F1115]',
              isActive ? 'border-[#4754E1]' : 'border-[#21262d]',
            )
          : 'border border-transparent',
      )}>
      {dense ? (
        <ChartPanelCompactHeader
          assetType={state.assetType}
          onAssetTypeChange={(assetType) =>
            onChange({assetType, selectedAssetId: null})
          }
          availableAssets={availableAssets}
          unavailableAssets={unavailableAssets}
          isLoading={isLoading}
          selectedAssetId={resolvedSelectedAssetId}
          onAssetSelect={(selectedAssetId) => onChange({selectedAssetId})}
          canTogglePrice={canTogglePrice}
          showPrice={state.showPrice}
          onTogglePrice={() => onChange({showPrice: !state.showPrice})}
          onClose={onClose}
        />
      ) : null}

      <View className={fill ? 'min-h-0 flex-1' : dense ? 'p-1.5' : undefined}>
        <ChartGraphSection
          view={state.view}
          metric={state.metric}
          isFiz={state.isFiz}
          interval={state.interval}
          period={state.period}
          selectedAsset={selectedAsset}
          resolvedSelectedAssetId={resolvedSelectedAssetId}
          chartWidth={chartWidth}
          chartHeight={chartHeight}
          showPrice={canTogglePrice ? state.showPrice : true}
          onTogglePrice={
            canTogglePrice
              ? () => onChange({showPrice: !state.showPrice})
              : undefined
          }
          dense={dense}
          hideLegend={hideLegend}
          fill={fill}
        />
      </View>
    </View>
  );
};
