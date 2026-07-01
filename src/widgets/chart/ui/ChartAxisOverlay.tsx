import {memo} from 'react';
import {Text, View} from 'react-native';
import {getChartYAxisScale} from '@shared/lib/deviceLayout';
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

const AXIS_LABEL_EDGE_PADDING = 2;
const MARK_LINE_LABEL_HEIGHT = 18;

const clampAxisLabelTop = (
  y: number,
  chartHeight: number,
  labelHeight: number,
) =>
  Math.max(
    AXIS_LABEL_EDGE_PADDING,
    Math.min(
      y - labelHeight / 2,
      chartHeight - labelHeight - AXIS_LABEL_EDGE_PADDING,
    ),
  );

export const ChartAxisOverlay = memo(function ChartAxisOverlay({
  chartData,
  width,
  height,
  markLines,
  compactGutters = false,
}: ChartAxisOverlayProps) {
  const yAxisScale = getChartYAxisScale(width);
  const plot = getChartPlotLayout(width, height, {
    compactGutters,
    leftYAxis: chartData.leftYAxis,
    rightYAxis: chartData.rightYAxis,
    yAxisFontSize: yAxisScale.fontSize,
  });
  const leftAxisLabelRight = width - plot.left + AXIS_LABEL_EDGE_PADDING;
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
            className="absolute text-[#8b949e]"
            style={{
              right: leftAxisLabelRight,
              top: clampAxisLabelTop(y, height, yAxisScale.labelHeight),
              fontSize: yAxisScale.fontSize,
              lineHeight: yAxisScale.lineHeight,
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
            className="absolute text-[#8b949e]"
            style={{
              left: plot.left + plot.width + AXIS_LABEL_EDGE_PADDING,
              top: clampAxisLabelTop(y, height, yAxisScale.labelHeight),
              width: plot.rightGutter - AXIS_LABEL_EDGE_PADDING * 2,
              fontSize: yAxisScale.fontSize,
              lineHeight: yAxisScale.lineHeight,
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
                height - 14 - AXIS_LABEL_EDGE_PADDING,
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
          const isRight = markLine.labelPosition === 'end';

          return (
            <View
              key={`${markLine.label}-${markLine.labelPosition}-${markLine.labelY}`}
              className="absolute"
              style={{
                left: isRight
                  ? plot.left + plot.width + AXIS_LABEL_EDGE_PADDING
                  : undefined,
                right: isRight ? undefined : leftAxisLabelRight,
                top: clampAxisLabelTop(
                  markLine.labelY,
                  height,
                  MARK_LINE_LABEL_HEIGHT,
                ),
              }}>
              <View
                className="shrink-0 rounded px-1.5 py-0.5"
                style={{backgroundColor: markLine.labelBackground}}>
                <Text
                  className="text-[11px] font-bold leading-[14px]"
                  style={{color: markLine.labelTextColor}}>
                  {markLine.label}
                </Text>
              </View>
            </View>
          );
        })}
    </View>
  );
});
