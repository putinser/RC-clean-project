import type {ChartPlotLayout, ChartYAxisConfig} from './chartSkia.types';

const AXIS_GUTTER_PADDING = 4;
const MIN_GUTTER = 34;
const MAX_GUTTER_RATIO = 0.3;
const LANDSCAPE_TOP_INSET = 42;
const LANDSCAPE_BOTTOM_INSET = 28;
const GRID_TOP_RATIO = 0.12;
const GRID_BOTTOM_RATIO = 0.1;
type ChartPlotLayoutOptions = {
  compactGutters?: boolean;
  leftYAxis?: ChartYAxisConfig;
  rightYAxis?: ChartYAxisConfig;
  yAxisFontSize?: number;
};

const estimateLabelWidth = (label: string, fontSize: number) => {
  let width = 0;

  for (const char of label) {
    if (char >= '0' && char <= '9') {
      width += 0.55 * fontSize;
      continue;
    }

    if (char === '-' || char === '+') {
      width += 0.35 * fontSize;
      continue;
    }

    if (char === ' ' || char === '\u00a0' || char === '\u202f') {
      width += 0.25 * fontSize;
      continue;
    }

    width += 0.55 * fontSize;
  }

  return Math.ceil(width);
};

const measureYAxisGutter = (
  axis: ChartYAxisConfig,
  fontSize: number,
  maxGutter: number,
) => {
  const ticks = buildYAxisTicks(axis);
  let maxLabelWidth = 0;

  for (const tick of ticks) {
    maxLabelWidth = Math.max(
      maxLabelWidth,
      estimateLabelWidth(tick.label, fontSize),
    );
  }

  return Math.min(
    maxGutter,
    Math.max(MIN_GUTTER, maxLabelWidth + AXIS_GUTTER_PADDING),
  );
};

export const getChartPlotLayout = (
  width: number,
  height: number,
  options?: ChartPlotLayoutOptions,
): ChartPlotLayout => {
  const compactGutters = options?.compactGutters ?? false;
  const fontSize = options?.yAxisFontSize ?? 10;
  const maxGutter = Math.max(MIN_GUTTER, Math.round(width * MAX_GUTTER_RATIO));

  const leftGutter = options?.leftYAxis
    ? measureYAxisGutter(options.leftYAxis, fontSize, maxGutter)
    : MIN_GUTTER;
  const rightGutter = options?.rightYAxis
    ? measureYAxisGutter(options.rightYAxis, fontSize, maxGutter)
    : MIN_GUTTER;

  const top = compactGutters ? LANDSCAPE_TOP_INSET : height * GRID_TOP_RATIO;
  const bottom = compactGutters
    ? LANDSCAPE_BOTTOM_INSET
    : height * GRID_BOTTOM_RATIO;

  return {
    left: leftGutter,
    top,
    width: Math.max(width - leftGutter - rightGutter, 120),
    height: Math.max(height - top - bottom, 120),
    leftGutter,
    rightGutter,
  };
};

export const timestampToX = (
  timestamp: number,
  xMin: number,
  xMax: number,
  plot: ChartPlotLayout,
) => {
  if (xMax === xMin) {
    return plot.left + plot.width / 2;
  }

  return plot.left + ((timestamp - xMin) / (xMax - xMin)) * plot.width;
};

export const valueToY = (
  value: number,
  yMin: number,
  yMax: number,
  plot: ChartPlotLayout,
) => {
  if (yMax === yMin) {
    return plot.top + plot.height / 2;
  }

  return plot.top + plot.height - ((value - yMin) / (yMax - yMin)) * plot.height;
};

export const xToTimestamp = (
  x: number,
  xMin: number,
  xMax: number,
  plot: ChartPlotLayout,
) => {
  const ratio = (x - plot.left) / plot.width;
  return xMin + ratio * (xMax - xMin);
};

export const buildYAxisTicks = (axis: ChartYAxisConfig) => {
  const ticks = [];
  const steps = Math.round((axis.max - axis.min) / axis.interval);

  for (let index = 0; index <= steps; index += 1) {
    const value = axis.min + axis.interval * index;
    if (value > axis.max + axis.interval * 0.001) {
      break;
    }

    const label = axis.formatLabel(value);
    if (!label) {
      continue;
    }

    ticks.push({value, label});
  }

  return ticks;
};

export const buildXAxisTicks = (
  xMin: number,
  xMax: number,
  periodInMilliseconds: number,
  formatLabel: (timestamp: number) => string,
  count = 5,
) => {
  if (xMax === xMin) {
    return [{value: xMin, label: formatLabel(xMin)}];
  }

  const ticks = [];
  const step = (xMax - xMin) / Math.max(count - 1, 1);

  for (let index = 0; index < count; index += 1) {
    const value = index === count - 1 ? xMax : xMin + step * index;
    const label = formatLabel(value);
    if (!label) {
      continue;
    }

    ticks.push({value, label});
  }

  return ticks;
};
