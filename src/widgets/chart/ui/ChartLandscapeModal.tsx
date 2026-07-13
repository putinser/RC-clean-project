import {useEffect, useState} from 'react';
import {Modal, Pressable, View, useWindowDimensions} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Spinner} from 'heroui-native/spinner';
import {X} from 'lucide-react-native';
import type {ChartMetricId} from '../config/chartMetric';
import type {ChartViewId} from '../config/chartView';
import {useChartLandscapeMode} from '../model/useChartLandscapeMode';
import type {ChartSkiaData} from '../lib/chartSkia.types';
import type {ChartAssetStats, ChartLegalSeriesItem} from '../lib/chartView.types';
import {ChartCanvas} from './ChartCanvas';
import {ChartLegend} from './ChartLegend';
import {ChartPriceOverlay} from './ChartPriceOverlay';

type ChartLandscapeModalProps = {
  visible: boolean;
  onClose: () => void;
  chartKey: string;
  chartData: ChartSkiaData | null;
  showSpinner: boolean;
  assetStats: ChartAssetStats;
  view: ChartViewId;
  legalSeries: ChartLegalSeriesItem[];
  priceColor: string;
  latestSignalValue?: number;
  signalThresholds?: {
    overbought: number;
    oversold: number;
  };
  metric: ChartMetricId;
  isFiz: boolean;
  showPrice?: boolean;
};

export const ChartLandscapeModal = ({
  visible,
  onClose,
  chartKey,
  chartData,
  showSpinner,
  assetStats,
  view,
  legalSeries,
  priceColor,
  latestSignalValue,
  signalThresholds,
  metric,
  isFiz,
  showPrice = true,
}: ChartLandscapeModalProps) => {
  useChartLandscapeMode(visible);
  const insets = useSafeAreaInsets();
  const {width, height} = useWindowDimensions();
  const isLandscapeReady = width > height;
  const [chartSize, setChartSize] = useState({width: 0, height: 0});

  useEffect(() => {
    if (!visible) {
      setChartSize({width: 0, height: 0});
    }
  }, [visible]);

  const chartWidth = chartSize.width;
  const chartHeight = chartSize.height;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      presentationStyle="fullScreen"
      supportedOrientations={['landscape-left', 'landscape-right']}
      onRequestClose={onClose}>
      <GestureHandlerRootView style={{flex: 1}}>
        <View
          className="flex-1 bg-background"
          style={{
            width: '100%',
            paddingLeft: insets.left,
            paddingRight: insets.right,
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
          }}>
          <View
            className="relative min-h-0 w-full flex-1"
            onLayout={(event) => {
              const {width: nextWidth, height: nextHeight} =
                event.nativeEvent.layout;
              setChartSize((previous) =>
                previous.width === nextWidth && previous.height === nextHeight
                  ? previous
                  : {width: nextWidth, height: nextHeight},
              );
            }}>
            {!isLandscapeReady || chartWidth === 0 || chartHeight === 0 ? (
              <View className="flex-1 items-center justify-center">
                <Spinner />
              </View>
            ) : (
              <ChartCanvas
                chartKey={`${chartKey}-landscape-${chartWidth}x${chartHeight}`}
                chartData={chartData}
                width={chartWidth}
                height={chartHeight}
                showSpinner={showSpinner}
                variant="fullBleed"
                compactGutters
                overlay={
                  <View className="absolute left-2 top-2 z-10">
                    <ChartPriceOverlay stats={assetStats} />
                  </View>
                }
              />
            )}

            <Pressable
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="Закрыть альбомный режим"
              className="absolute right-3 top-3 z-20 h-9 w-9 items-center justify-center rounded-full bg-[#ffffff16]">
              <X size={18} color="#FFFFFF" />
            </Pressable>
          </View>

          <ChartLegend
            view={view}
            legalSeries={legalSeries}
            priceColor={priceColor}
            latestPrice={assetStats.latestPrice}
            latestSignalValue={latestSignalValue}
            signalThresholds={signalThresholds}
            metric={metric}
            isFiz={isFiz}
            showPrice={showPrice}
            variant="compact"
          />
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
};
