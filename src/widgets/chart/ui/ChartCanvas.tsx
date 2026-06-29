import {
  useCallback,
  useDeferredValue,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {Text, View} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {runOnJS} from 'react-native-reanimated';
import {Spinner} from 'heroui-native/spinner';
import {buildChartTooltipLines} from '../lib/buildChartTooltip';
import {buildSkiaChartPaths} from '../lib/buildSkiaPaths';
import {xToTimestamp} from '../lib/chartLayout';
import type {ChartSkiaData, ChartTooltipState} from '../lib/chartSkia.types';
import {ChartAxisOverlay} from './ChartAxisOverlay';
import {ChartStaticLayer} from './ChartStaticLayer';

const TOOLTIP_OFFSET_X = 248;
const TOOLTIP_OFFSET_Y = 96;
const TOOLTIP_WIDTH = 200;

type ChartCanvasProps = {
  chartKey: string;
  chartData: ChartSkiaData | null;
  width?: number;
  height?: number;
  showSpinner: boolean;
  overlay?: ReactNode;
  variant?: 'default' | 'fullBleed';
  fill?: boolean;
  compactGutters?: boolean;
};

export const ChartCanvas = ({
  chartKey,
  chartData,
  width: widthProp = 0,
  height: heightProp = 0,
  showSpinner,
  overlay,
  variant = 'default',
  fill = false,
  compactGutters = false,
}: ChartCanvasProps) => {
  const isFullBleed = variant === 'fullBleed';
  const [fillSize, setFillSize] = useState({width: 0, height: 0});
  const width = fill ? fillSize.width : widthProp;
  const height = fill ? fillSize.height : heightProp;
  const deferredChartData = useDeferredValue(chartData);
  const [tooltip, setTooltip] = useState<ChartTooltipState | null>(null);
  const plotRef = useRef<ReturnType<typeof buildSkiaChartPaths>['plot'] | null>(
    null,
  );
  const chartDataRef = useRef(deferredChartData);
  const rafRef = useRef<number | null>(null);
  const pendingTouchRef = useRef<{x: number; y: number} | null>(null);

  chartDataRef.current = deferredChartData;

  const rendered = useMemo(() => {
    if (!deferredChartData) {
      plotRef.current = null;
      return null;
    }

    const nextRendered = buildSkiaChartPaths(deferredChartData, width, height, {
      compactGutters,
    });
    plotRef.current = nextRendered.plot;
    return nextRendered;
  }, [compactGutters, deferredChartData, width, height]);

  const applyTooltipAt = useCallback((x: number, y: number) => {
    const plot = plotRef.current;
    const data = chartDataRef.current;

    if (!plot || !data) {
      setTooltip(null);
      return;
    }

    if (
      x < plot.left ||
      x > plot.left + plot.width ||
      y < plot.top ||
      y > plot.top + plot.height
    ) {
      setTooltip(null);
      return;
    }

    const timestamp = xToTimestamp(
      x,
      data.xRange.min,
      data.xRange.max,
      plot,
    );
    const lines = buildChartTooltipLines(timestamp, data.tooltipSeries);

    setTooltip((previous) => {
      const linesKey = lines
        .map((line) => `${line.text}|${line.color ?? ''}`)
        .join('||');

      if (
        previous &&
        previous.x === x &&
        previous.y === y &&
        previous.lines
          .map((line) => `${line.text}|${line.color ?? ''}`)
          .join('||') === linesKey
      ) {
        return previous;
      }

      return {x, y, lines};
    });
  }, []);

  const scheduleTooltipAt = useCallback(
    (x: number, y: number) => {
      pendingTouchRef.current = {x, y};

      if (rafRef.current !== null) {
        return;
      }

      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        const pending = pendingTouchRef.current;
        if (!pending) {
          return;
        }
        applyTooltipAt(pending.x, pending.y);
      });
    },
    [applyTooltipAt],
  );

  const clearTooltip = useCallback(() => {
    pendingTouchRef.current = null;
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setTooltip(null);
  }, []);

  const panGesture = Gesture.Pan()
    .minDistance(0)
    .onBegin((event) => {
      runOnJS(scheduleTooltipAt)(event.x, event.y);
    })
    .onUpdate((event) => {
      runOnJS(scheduleTooltipAt)(event.x, event.y);
    })
    .onFinalize(() => {
      runOnJS(clearTooltip)();
    });

  const tapGesture = Gesture.Tap().onEnd((event) => {
    runOnJS(scheduleTooltipAt)(event.x, event.y);
  });

  const gesture = Gesture.Simultaneous(panGesture, tapGesture);

  const chartBody = (
    <>
      {!showSpinner ? overlay : null}
      {showSpinner ? (
        <View className="absolute inset-0 z-20 items-center justify-center bg-[#0F1115]">
          <Spinner />
        </View>
      ) : null}

      {!showSpinner && deferredChartData && rendered ? (
        <>
          <GestureDetector gesture={gesture}>
            <View style={{width, height}}>
              <ChartStaticLayer
                chartKey={chartKey}
                width={width}
                height={height}
                rendered={rendered}
              />
            </View>
          </GestureDetector>

          <ChartAxisOverlay
            chartData={deferredChartData}
            width={width}
            height={height}
            markLines={rendered.markLines}
            compactGutters={compactGutters}
          />

          {tooltip ? (
            <>
              <View
                pointerEvents="none"
                className="absolute z-20 bg-[#8b949e]"
                style={{
                  left: tooltip.x,
                  top: rendered.plot.top,
                  width: 1,
                  height: rendered.plot.height,
                  opacity: 0.6,
                }}
              />
              <View
                pointerEvents="none"
                className="absolute z-30 rounded-xl border border-[#21262d] bg-[rgba(15,17,21,0.85)] px-4 py-3"
                style={{
                  left: Math.min(
                    Math.max(tooltip.x - TOOLTIP_OFFSET_X, 8),
                    width - TOOLTIP_WIDTH - 8,
                  ),
                  top: Math.max(tooltip.y - TOOLTIP_OFFSET_Y, 8),
                  maxWidth: TOOLTIP_WIDTH,
                }}>
                {tooltip.lines.map((line, index) =>
                  line.color ? (
                    <View
                      key={`${line.text}-${index}`}
                      className={`flex-row items-center gap-2 ${index > 0 ? 'mt-1' : ''}`}>
                      <View
                        className="h-0.5 w-4 shrink-0"
                        style={{backgroundColor: line.color}}
                      />
                      <Text className="shrink text-xs text-white">{line.text}</Text>
                    </View>
                  ) : (
                    <Text
                      key={`${line.text}-${index}`}
                      className={`text-xs text-white ${index > 0 ? 'mt-1' : ''}`}>
                      {line.text}
                    </Text>
                  ),
                )}
              </View>
            </>
          ) : null}
        </>
      ) : null}
    </>
  );

  if (isFullBleed && fill) {
    return (
      <View
        style={{flex: 1, width: '100%', alignSelf: 'stretch'}}
        onLayout={(event) => {
          const {width: nextWidth, height: nextHeight} = event.nativeEvent.layout;
          setFillSize((previous) =>
            previous.width === nextWidth && previous.height === nextHeight
              ? previous
              : {width: nextWidth, height: nextHeight},
          );
        }}
        className="relative bg-[#0d1117]">
        {width > 0 && height > 0 ? chartBody : null}
      </View>
    );
  }

  if (isFullBleed) {
    return (
      <View
        style={{width, height}}
        className="relative bg-[#0d1117]">
        {chartBody}
      </View>
    );
  }

  return (
    <View className="rounded-2xl border border-[#21262d] bg-[#0F1115] p-3">
      <View
        style={{width, height}}
        className="relative overflow-hidden rounded-xl bg-[#0d1117]">
        {chartBody}
      </View>
    </View>
  );
};
