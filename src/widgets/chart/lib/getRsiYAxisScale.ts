export const getRsiYAxisScale = (values: number[]) => {
  let min = Infinity;
  let max = -Infinity;
  let count = 0;

  for (let index = 0; index < values.length; index += 1) {
    const value = values[index];
    if (value === null) {
      continue;
    }

    count += 1;
    if (value < min) min = value;
    if (value > max) max = value;
  }

  if (count === 0) {
    return {min: 0, max: 100, interval: 12.5};
  }

  const range = max - min;
  const middle = range / 2;

  if (range === 0) {
    return {min: 0, max: 100, interval: 12.5};
  }

  const step = range / 10;
  min = Math.floor(min / step) * step;
  min -= Math.abs(middle * 0.5);
  if (range > 10) min = Math.floor(min);

  max = Math.ceil(max / step) * step;
  max += Math.abs(middle * 0.5);
  if (range > 10) max = Math.ceil(max);

  return {min, max, interval: (max - min) / 8};
};
