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
const AXIS_LABEL_PLOT_GAP = 0;
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

export const ChartAxisOverlay = memo(function ChartAxisOverlayComponent({
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
  const leftAxisLabelWidth = Math.max(plot.left - AXIS_LABEL_PLOT_GAP, 0);
  const rightAxisLabelLeft = plot.left + plot.width + AXIS_LABEL_PLOT_GAP;
  const rightAxisLabelWidth = Math.max(
    width - rightAxisLabelLeft,
    0,
  );
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
            className="absolute left-0 text-left text-[#8b949e]"
            style={{
              top: clampAxisLabelTop(y, height, yAxisScale.labelHeight),
              width: leftAxisLabelWidth,
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
            className="absolute text-right text-[#8b949e]"
            style={{
              left: rightAxisLabelLeft,
              top: clampAxisLabelTop(y, height, yAxisScale.labelHeight),
              width: rightAxisLabelWidth,
              fontSize: yAxisScale.fontSize,
              lineHeight: yAxisScale.lineHeight,
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
            className="absolute w-16 text-center text-[10px] leading-[14px] text-[#8b949e]"
            style={{
              left: Math.max(
                AXIS_LABEL_EDGE_PADDING,
                Math.min(x - 32, width - 64 - AXIS_LABEL_EDGE_PADDING),
              ),
              top: Math.min(
                plot.top + plot.height + 8,
                height - 14 - AXIS_LABEL_EDGE_PADDING,
              ),
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
              className={`absolute ${isRight ? 'items-end' : 'left-0'}`}
              style={{
                left: isRight ? rightAxisLabelLeft : undefined,
                maxWidth: isRight
                  ? rightAxisLabelWidth
                  : leftAxisLabelWidth,
                top: clampAxisLabelTop(
                  markLine.labelY,
                  height,
                  MARK_LINE_LABEL_HEIGHT,
                ),
              }}>
              <View
                className={`absolute shrink-0 px-1.5 py-1 ${isRight ? '-right-10' : 'left-0'}`}
                style={{
                  backgroundColor: markLine.labelBackground,
                  borderTopLeftRadius: markLine.labelBorderRadius[0],
                  borderTopRightRadius: markLine.labelBorderRadius[1],
                  borderBottomRightRadius: markLine.labelBorderRadius[2],
                  borderBottomLeftRadius: markLine.labelBorderRadius[3],
                }}>
                <Text
                  className="text-[10px] font-bold leading-[14px]"
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
