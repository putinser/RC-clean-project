import type {ChartColoredSegment, ChartPoint} from './chartSkia.types';

export const buildColoredSegments = (
  points: ChartPoint[],
  getColor: (point: ChartPoint, index: number) => string,
): ChartColoredSegment[] => {
  if (points.length === 0) {
    return [];
  }

  const segments: ChartColoredSegment[] = [];
  let currentColor = getColor(points[0], 0);
  let currentPoints: ChartPoint[] = [points[0]];

  for (let index = 1; index < points.length; index += 1) {
    const point = points[index];
    const color = getColor(point, index);

    if (color === currentColor) {
      currentPoints.push(point);
      continue;
    }

    const previousPoint = points[index - 1];
    currentPoints.push(previousPoint);
    segments.push({color: currentColor, points: currentPoints});
    currentColor = color;
    currentPoints = [previousPoint, point];
  }

  segments.push({color: currentColor, points: currentPoints});
  return segments;
};
