import {memo} from 'react';
import {Text, View} from 'react-native';
import {
  buildXAxisTicks,
  buildYAxisTicks,
  getChartPlotLayout,
  timestampToX,
  valueToY,
} from '../lib/chartLayout';
import {formatChartTimestampLabel} from '../lib/buildSkiaChartData';
import type {ChartRenderedMarkLine} from '../lib/chartSkia.types';
import type {ChartSkiaData} from '../lib/chartSkia.types';

type ChartAxisOverlayProps = {
  chartData: ChartSkiaData;
  width: number;
  height: number;
  markLines: ChartRenderedMarkLine[];
  compactGutters?: boolean;
};

const AXIS_LABEL_HEIGHT = 14;
const AXIS_LABEL_EDGE_PADDING = 4;

const clampAxisLabelTop = (y: number, chartHeight: number) =>
  Math.max(
    AXIS_LABEL_EDGE_PADDING,
    Math.min(
      y - AXIS_LABEL_HEIGHT / 2,
      chartHeight - AXIS_LABEL_HEIGHT - AXIS_LABEL_EDGE_PADDING,
    ),
  );

export const ChartAxisOverlay = memo(function ChartAxisOverlay({
  chartData,
  width,
  height,
  markLines,
  compactGutters = false,
}: ChartAxisOverlayProps) {
  const plot = getChartPlotLayout(width, height, {compactGutters});
  const leftTicks = buildYAxisTicks(chartData.leftYAxis);
  const rightTicks = chartData.rightYAxis
    ? buildYAxisTicks(chartData.rightYAxis)
    : [];
  const xTicks = buildXAxisTicks(
    chartData.xRange.min,
    chartData.xRange.max,
    chartData.periodInMilliseconds,
    (timestamp) =>
      formatChartTimestampLabel(timestamp, chartData.periodInMilliseconds),
  );

  return (
    <View
      pointerEvents="none"
      className="absolute inset-0 z-10"
      style={{width, height}}>
      {leftTicks.map((tick) => {
        const y = valueToY(
          tick.value,
          chartData.leftYAxis.min,
          chartData.leftYAxis.max,
          plot,
        );

        return (
          <Text
            key={`left-${tick.value}`}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.75}
            className="absolute text-[10px] leading-[14px] text-[#8b949e]"
            style={{
              left: AXIS_LABEL_EDGE_PADDING,
              top: clampAxisLabelTop(y, height),
              width: plot.leftGutter - AXIS_LABEL_EDGE_PADDING * 2,
              height: AXIS_LABEL_HEIGHT,
              textAlign: 'right',
            }}>
            {tick.label}
          </Text>
        );
      })}

      {rightTicks.map((tick) => {
        const y = valueToY(
          tick.value,
          chartData.rightYAxis!.min,
          chartData.rightYAxis!.max,
          plot,
        );

        return (
          <Text
            key={`right-${tick.value}`}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.75}
            className="absolute text-[10px] leading-[14px] text-[#8b949e]"
            style={{
              left: plot.left + plot.width + AXIS_LABEL_EDGE_PADDING,
              top: clampAxisLabelTop(y, height),
              width: plot.rightGutter - AXIS_LABEL_EDGE_PADDING * 2,
              height: AXIS_LABEL_HEIGHT,
              textAlign: 'left',
            }}>
            {tick.label}
          </Text>
        );
      })}

      {xTicks.map((tick) => {
        const x = timestampToX(
          tick.value,
          chartData.xRange.min,
          chartData.xRange.max,
          plot,
        );

        return (
          <Text
            key={`x-${tick.value}`}
            numberOfLines={1}
            className="absolute text-[10px] leading-[14px] text-[#8b949e]"
            style={{
              left: Math.max(
                AXIS_LABEL_EDGE_PADDING,
                Math.min(x - 32, width - 64 - AXIS_LABEL_EDGE_PADDING),
              ),
              top: Math.min(
                plot.top + plot.height + 8,
                height - AXIS_LABEL_HEIGHT - AXIS_LABEL_EDGE_PADDING,
              ),
              width: 64,
              textAlign: 'center',
            }}>
            {tick.label}
          </Text>
        );
      })}

      {markLines
        .filter((markLine) => markLine.label)
        .map((markLine) => {
          const isRight = markLine.labelX > plot.left + plot.width / 2;

          return (
            <View
              key={`${markLine.label}-${markLine.labelX}`}
              className="absolute rounded px-1.5 py-0.5"
              style={{
                left: isRight ? undefined : plot.left + 6,
                right: isRight
                  ? Math.max(
                      AXIS_LABEL_EDGE_PADDING,
                      width - markLine.labelX,
                    )
                  : undefined,
                top: Math.max(
                  AXIS_LABEL_EDGE_PADDING,
                  Math.min(markLine.labelY - 10, height - 24),
                ),
                backgroundColor: markLine.labelBackground,
                maxWidth: 88,
              }}>
              <Text
                numberOfLines={1}
                className="text-[11px] font-bold leading-[14px]"
                style={{color: markLine.labelTextColor}}>
                {markLine.label}
              </Text>
            </View>
          );
        })}
    </View>
  );
});
