import type {ChartPlotLayout, ChartYAxisConfig} from './chartSkia.types';

const MIN_LEFT_GUTTER = 44;
const MIN_RIGHT_GUTTER = 52;
const LANDSCAPE_LEFT_GUTTER = 48;
const LANDSCAPE_RIGHT_GUTTER = 74;
const LANDSCAPE_TOP_INSET = 42;
const LANDSCAPE_BOTTOM_INSET = 28;
const GRID_TOP_RATIO = 0.12;
const GRID_BOTTOM_RATIO = 0.1;

type ChartPlotLayoutOptions = {
  compactGutters?: boolean;
};

export const getChartPlotLayout = (
  width: number,
  height: number,
  options?: ChartPlotLayoutOptions,
): ChartPlotLayout => {
  const compactGutters = options?.compactGutters ?? false;
  const leftGutter = compactGutters
    ? LANDSCAPE_LEFT_GUTTER
    : Math.max(Math.round(width * 0.14), MIN_LEFT_GUTTER);
  const rightGutter = compactGutters
    ? LANDSCAPE_RIGHT_GUTTER
    : Math.max(Math.round(width * 0.16), MIN_RIGHT_GUTTER);
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
