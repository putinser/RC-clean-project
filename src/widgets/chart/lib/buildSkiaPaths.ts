import {Skia} from '@shopify/react-native-skia';
import {
  getChartPlotLayout,
  valueToY,
} from './chartLayout';
import {
  downsampleLTTB,
  downsampleStepPoints,
  getMaxRenderPoints,
} from './downsampleChartPoints';
import type {
  ChartLineSeries,
  ChartMarkLine,
  ChartPlotLayout,
  ChartPoint,
  ChartRenderedMarkLine,
  ChartRenderedPath,
  ChartSkiaData,
  ChartYAxisConfig,
} from './chartSkia.types';

const GRID_COLOR = '#21262d';

export type ChartRenderedMarkLinePath = ChartRenderedPath & {
  dashed: boolean;
};

type PathScale = {
  xMin: number;
  xMax: number;
  xFactor: number;
  plotLeft: number;
  plotWidth: number;
  yMin: number;
  yMax: number;
  yFactor: number;
  plotTop: number;
  plotHeight: number;
};

const createPathScale = (
  plot: ChartPlotLayout,
  xMin: number,
  xMax: number,
  yAxis: ChartYAxisConfig,
): PathScale => ({
  xMin,
  xMax,
  xFactor: xMax === xMin ? 0 : plot.width / (xMax - xMin),
  plotLeft: plot.left,
  plotWidth: plot.width,
  yMin: yAxis.min,
  yMax: yAxis.max,
  yFactor: yAxis.max === yAxis.min ? 0 : plot.height / (yAxis.max - yAxis.min),
  plotTop: plot.top,
  plotHeight: plot.height,
});

const pointToXY = (point: ChartPoint, scale: PathScale) => ({
  x:
    scale.xFactor === 0
      ? scale.plotLeft + scale.plotWidth / 2
      : scale.plotLeft + (point.timestamp - scale.xMin) * scale.xFactor,
  y:
    scale.yFactor === 0
      ? scale.plotTop + scale.plotHeight / 2
      : scale.plotTop +
        scale.plotHeight -
        (point.value - scale.yMin) * scale.yFactor,
});

const prepareRenderPoints = (
  points: ChartPoint[],
  maxRenderPoints: number,
  step?: 'end',
) => {
  if (points.length <= maxRenderPoints) {
    return points;
  }

  return step === 'end'
    ? downsampleStepPoints(points, maxRenderPoints)
    : downsampleLTTB(points, maxRenderPoints);
};

const buildSeriesPath = (
  points: ChartPoint[],
  scale: PathScale,
  step?: 'end',
) => {
  const path = Skia.Path.Make();

  if (points.length === 0) {
    return path;
  }

  const first = pointToXY(points[0], scale);
  path.moveTo(first.x, first.y);

  for (let index = 1; index < points.length; index += 1) {
    const current = pointToXY(points[index], scale);

    if (step === 'end') {
      const previous = pointToXY(points[index - 1], scale);
      path.lineTo(current.x, previous.y);
    }

    path.lineTo(current.x, current.y);
  }

  return path;
};

const buildGridPaths = (
  chartData: ChartSkiaData,
  plot: ChartPlotLayout,
) => {
  const paths: ChartRenderedPath[] = [];
  const steps = Math.round(
    (chartData.leftYAxis.max - chartData.leftYAxis.min) /
      chartData.leftYAxis.interval,
  );

  for (let index = 0; index <= steps; index += 1) {
    const value = chartData.leftYAxis.min + chartData.leftYAxis.interval * index;
    const y = valueToY(
      value,
      chartData.leftYAxis.min,
      chartData.leftYAxis.max,
      plot,
    );
    const linePath = Skia.Path.Make();
    linePath.moveTo(plot.left, y);
    linePath.lineTo(plot.left + plot.width, y);
    paths.push({
      path: linePath,
      color: GRID_COLOR,
      strokeWidth: 1,
    });
  }

  const xStep = plot.width / 5;
  for (let index = 0; index <= 5; index += 1) {
    const x = plot.left + xStep * index;
    const linePath = Skia.Path.Make();
    linePath.moveTo(x, plot.top);
    linePath.lineTo(x, plot.top + plot.height);
    paths.push({
      path: linePath,
      color: GRID_COLOR,
      strokeWidth: 1,
    });
  }

  return paths;
};

const buildMarkLines = (
  markLines: ChartMarkLine[],
  plot: ChartPlotLayout,
  leftYAxis: ChartYAxisConfig,
  rightYAxis: ChartYAxisConfig | undefined,
): ChartRenderedMarkLine[] =>
  markLines.map((markLine) => {
    const axis =
      markLine.yAxis === 'right' ? rightYAxis ?? leftYAxis : leftYAxis;
    const y = valueToY(markLine.y, axis.min, axis.max, plot);
    const labelPosition = markLine.labelPosition ?? 'start';

    return {
      y,
      color: markLine.color,
      dashed: markLine.dashed ?? true,
      label: markLine.label,
      labelPosition,
      labelY: y,
      labelBackground: markLine.color,
      labelTextColor: markLine.labelTextColor ?? '#FFFFFF',
    };
  });

export const buildSkiaChartPaths = (
  chartData: ChartSkiaData,
  width: number,
  height: number,
  options?: {compactGutters?: boolean; yAxisFontSize?: number},
) => {
  const plot = getChartPlotLayout(width, height, {
    compactGutters: options?.compactGutters,
    leftYAxis: chartData.leftYAxis,
    rightYAxis: chartData.rightYAxis,
    yAxisFontSize: options?.yAxisFontSize,
  });
  const maxRenderPoints = getMaxRenderPoints(plot.width);
  const {min: xMin, max: xMax} = chartData.xRange;
  const seriesPaths: ChartRenderedPath[] = [];

  chartData.series.forEach((series: ChartLineSeries) => {
    const yAxis =
      series.yAxis === 'right'
        ? chartData.rightYAxis ?? chartData.leftYAxis
        : chartData.leftYAxis;
    const scale = createPathScale(plot, xMin, xMax, yAxis);
    const segments = series.coloredSegments ?? [
      {color: series.color, points: series.points},
    ];
    const segmentBudget = Math.max(
      2,
      Math.floor(maxRenderPoints / Math.max(segments.length, 1)),
    );

    segments.forEach((segment) => {
      if (segment.points.length === 0) {
        return;
      }

      const renderPoints = prepareRenderPoints(
        segment.points,
        segmentBudget,
        series.step,
      );

      seriesPaths.push({
        path: buildSeriesPath(renderPoints, scale, series.step),
        color: segment.color,
        strokeWidth: 2,
      });
    });
  });

  const markLines = buildMarkLines(
    chartData.markLines,
    plot,
    chartData.leftYAxis,
    chartData.rightYAxis,
  );

  const markLinePaths: ChartRenderedMarkLinePath[] = markLines.map(
    (markLine) => {
      const linePath = Skia.Path.Make();
      linePath.moveTo(plot.left, markLine.y);
      linePath.lineTo(plot.left + plot.width, markLine.y);

      return {
        path: linePath,
        color: markLine.color,
        strokeWidth: 1,
        dashed: markLine.dashed,
      };
    },
  );

  return {
    plot,
    gridPaths: buildGridPaths(chartData, plot),
    seriesPaths,
    markLinePaths,
    markLines,
  };
};
