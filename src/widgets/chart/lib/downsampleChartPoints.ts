import type {ChartPoint} from './chartSkia.types';

export const getMaxRenderPoints = (plotWidth: number) =>
  Math.max(Math.ceil(plotWidth * 2), 64);

export const downsampleLTTB = (
  points: ChartPoint[],
  threshold: number,
): ChartPoint[] => {
  if (points.length <= threshold || threshold < 3) {
    return points;
  }

  const sampled: ChartPoint[] = [points[0]];
  const bucketSize = (points.length - 2) / (threshold - 2);
  let previousIndex = 0;

  for (let index = 0; index < threshold - 2; index += 1) {
    const nextBucketStart = Math.floor((index + 1) * bucketSize) + 1;
    const nextBucketEnd = Math.min(
      Math.floor((index + 2) * bucketSize) + 1,
      points.length,
    );

    let averageTimestamp = 0;
    let averageValue = 0;
    let averageCount = 0;

    for (
      let pointIndex = nextBucketStart;
      pointIndex < nextBucketEnd;
      pointIndex += 1
    ) {
      averageTimestamp += points[pointIndex].timestamp;
      averageValue += points[pointIndex].value;
      averageCount += 1;
    }

    if (averageCount > 0) {
      averageTimestamp /= averageCount;
      averageValue /= averageCount;
    }

    const bucketStart = Math.floor(index * bucketSize) + 1;
    const bucketEnd = Math.min(
      Math.floor((index + 1) * bucketSize) + 1,
      points.length,
    );

    let maxArea = -1;
    let maxAreaIndex = bucketStart;
    const anchor = points[previousIndex];

    for (let pointIndex = bucketStart; pointIndex < bucketEnd; pointIndex += 1) {
      const point = points[pointIndex];
      const area = Math.abs(
        (anchor.timestamp - averageTimestamp) * (point.value - anchor.value) -
          (anchor.timestamp - point.timestamp) * (averageValue - anchor.value),
      );

      if (area > maxArea) {
        maxArea = area;
        maxAreaIndex = pointIndex;
      }
    }

    sampled.push(points[maxAreaIndex]);
    previousIndex = maxAreaIndex;
  }

  sampled.push(points[points.length - 1]);
  return sampled;
};

export const downsampleStepPoints = (
  points: ChartPoint[],
  threshold: number,
): ChartPoint[] => {
  if (points.length <= threshold) {
    return points;
  }

  const bucketSize = points.length / threshold;
  const sampled: ChartPoint[] = [points[0]];

  for (let index = 1; index < threshold - 1; index += 1) {
    const sourceIndex = Math.round(index * bucketSize);
    sampled.push(points[Math.min(sourceIndex, points.length - 1)]);
  }

  sampled.push(points[points.length - 1]);
  return sampled;
};
