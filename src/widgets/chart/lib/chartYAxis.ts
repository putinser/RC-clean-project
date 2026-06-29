export const Y_AXIS_BASELINE_OFFSET = 1000;
export const Y_AXIS_SPLIT_COUNT = 8;

export const shiftChartValue = (value: number) => value + Y_AXIS_BASELINE_OFFSET;

export const toRealChartValue = (chartValue: number) =>
  chartValue - Y_AXIS_BASELINE_OFFSET;

export const formatChartAxisValue = (chartValue: number) => {
  const realValue = toRealChartValue(chartValue);
  if (realValue === 0) return '';
  return realValue.toLocaleString('ru-RU');
};

const roundToNiceInterval = (rough: number) => {
  const magnitude = 10 ** Math.floor(Math.log10(Math.abs(rough) || 1));
  const normalized = rough / magnitude;

  if (normalized <= 1) return 1 * magnitude;
  if (normalized <= 2) return 2 * magnitude;
  if (normalized <= 5) return 5 * magnitude;
  return 10 * magnitude;
};

const getAxisScaleFromMinMax = (
  dataMin: number,
  dataMax: number,
  emptyFallback: number,
) => {
  const tickSteps = Y_AXIS_SPLIT_COUNT - 1;

  if (dataMin === Infinity || dataMax === -Infinity) {
    return {
      min: -emptyFallback,
      max: -emptyFallback + emptyFallback * tickSteps,
      interval: emptyFallback,
    };
  }

  const padding = (dataMax - dataMin) * 0.1 || emptyFallback;
  const targetMin = dataMin - padding;
  const targetMax = dataMax + padding;

  let interval = roundToNiceInterval((targetMax - targetMin) / tickSteps);

  while (true) {
    const min = Math.floor(targetMin / interval) * interval;
    const max = min + interval * tickSteps;

    if (min <= dataMin && max >= dataMax) {
      return {min, max, interval};
    }

    const magnitude = 10 ** Math.floor(Math.log10(interval));
    const normalized = interval / magnitude;

    if (normalized < 1.9) interval = 2 * magnitude;
    else if (normalized < 4.9) interval = 5 * magnitude;
    else interval = 10 * magnitude;
  }
};

const getMinMax = (values: number[]) => {
  if (values.length === 0) {
    return {min: Infinity, max: -Infinity};
  }

  let min = values[0];
  let max = values[0];

  for (let index = 1; index < values.length; index += 1) {
    const value = values[index];
    if (value < min) min = value;
    if (value > max) max = value;
  }

  return {min, max};
};

export const getYAxisScale = (values: number[]) => {
  const {min, max} = getMinMax(values);

  if (values.length === 0) {
    return getAxisScaleFromMinMax(Infinity, -Infinity, Y_AXIS_BASELINE_OFFSET);
  }

  return getAxisScaleFromMinMax(
    shiftChartValue(min),
    shiftChartValue(max),
    Y_AXIS_BASELINE_OFFSET,
  );
};

export const getPriceYAxisScale = (values: number[]) => {
  const {min, max} = getMinMax(values);
  return getAxisScaleFromMinMax(min, max, 1);
};

export const getYAxisScaleFromShiftedRange = (min: number, max: number) =>
  getAxisScaleFromMinMax(min, max, Y_AXIS_BASELINE_OFFSET);
