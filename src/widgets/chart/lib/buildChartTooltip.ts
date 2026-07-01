import type {ChartPoint, ChartTooltipEntry, ChartTooltipSeries} from './chartSkia.types';

const formatTooltipDate = (targetTimestamp: number) => {
  const date = new Date(targetTimestamp);
  return date.toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getTooltipLineKey = (line: ChartTooltipEntry) =>
  `${line.variant ?? 'default'}|${line.text}|${line.color ?? ''}|${line.value ?? ''}`;

export const findNearestPoint = (
  points: ChartPoint[],
  targetTimestamp: number,
) => {
  if (points.length === 0) {
    return null;
  }

  let left = 0;
  let right = points.length - 1;

  while (left < right) {
    const middle = Math.floor((left + right) / 2);
    if (points[middle].timestamp < targetTimestamp) {
      left = middle + 1;
    } else {
      right = middle;
    }
  }

  const candidate = points[left];
  const previous = points[Math.max(left - 1, 0)];

  if (
    Math.abs(previous.timestamp - targetTimestamp) <
    Math.abs(candidate.timestamp - targetTimestamp)
  ) {
    return previous;
  }

  return candidate;
};

export const buildChartTooltipLines = (
  targetTimestamp: number,
  tooltipSeries: ChartTooltipSeries[],
) => {
  const lines: ChartTooltipEntry[] = [
    {text: formatTooltipDate(targetTimestamp)},
  ];

  tooltipSeries.forEach((series) => {
    const nearestPoint = findNearestPoint(series.points, targetTimestamp);
    if (!nearestPoint) {
      return;
    }

    lines.push({
      text: `${series.name}: ${series.formatValue(nearestPoint.value)}`,
      color: series.getColor?.(nearestPoint.value) ?? series.color,
    });
  });

  return lines;
};

export const buildSimpleChartTooltipLines = (
  targetTimestamp: number,
  tooltipSeries: ChartTooltipSeries[],
) => {
  const lines: ChartTooltipEntry[] = [
    {text: formatTooltipDate(targetTimestamp), variant: 'date'},
  ];

  const series = tooltipSeries[0];
  if (!series) {
    return lines;
  }

  const nearestPoint = findNearestPoint(series.points, targetTimestamp);
  if (!nearestPoint) {
    return lines;
  }

  lines.push({
    text: series.name,
    color: series.getColor?.(nearestPoint.value) ?? series.color,
    value: series.formatValue(nearestPoint.value),
    variant: 'metric',
  });

  return lines;
};
