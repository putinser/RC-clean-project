import type {AssetItem, PriceReportItem, RsiReportItem} from '@services/assets/types';
import {
  getLegalSeriesConfigs,
  getLegalSeriesLabel,
  type ChartMetricId,
} from '../config/chartMetric';
import type {ChartViewId} from '../config/chartView';
import {formatChartXAxisLabel} from './chartAxisLabels';
import {buildColoredSegments} from './buildColoredSegments';
import {getPriceLineColors} from './chartPriceColors';
import {CHART_SIGNAL_COLORS, getRsiSignalColor} from './chartSignalColors';
import {
  getChartPriceValue,
  parseChartMoment,
  sortChartItemsByMoment,
} from './chartSeries';
import type {ChartLegalSeriesItem} from './chartView.types';
import {
  formatChartAxisValue,
  getPriceYAxisScale,
  getYAxisScaleFromShiftedRange,
  shiftChartValue,
  toRealChartValue,
} from './chartYAxis';
import {getRsiYAxisScale} from './getRsiYAxisScale';
import {getAssetRsiThresholds} from './getAssetRsiThresholds';
import type {
  ChartLineSeries,
  ChartMarkLine,
  ChartPoint,
  ChartSkiaData,
  ChartTooltipSeries,
} from './chartSkia.types';
import type {Asset} from '@services/assets/types';

const formatSignalThresholdLabel = (value: number) =>
  Math.round(value).toString();

const mapPoints = (
  items: Array<{moment: string; value: number}>,
): ChartPoint[] =>
  items.map((item) => ({
    timestamp: parseChartMoment(item.moment),
    value: item.value,
  }));

const getXRange = (points: ChartPoint[]) => {
  if (points.length === 0) {
    return {min: 0, max: 1};
  }

  return {
    min: points[0].timestamp,
    max: points[points.length - 1].timestamp,
  };
};

const buildLatestMarkLine = (
  series: ChartLineSeries,
  labelPosition: 'start' | 'end',
  labelTextColor = '#FFFFFF',
): ChartMarkLine | null => {
  if (series.latestValue == null || series.points.length === 0) {
    return null;
  }

  const latestPoint = series.points[series.points.length - 1];

  return {
    y: latestPoint.value,
    yAxis: series.yAxis,
    color: series.color,
    label: series.latestValue.toLocaleString('ru-RU'),
    labelPosition,
    labelTextColor,
    dashed: true,
  };
};

export interface BuildSkiaChartDataResult {
  chartData: ChartSkiaData;
  legalSeries: ChartLegalSeriesItem[];
  priceColor: string;
  latestPrice?: number;
  latestRsi?: number;
  signalThresholds?: {
    overbought: number;
    oversold: number;
  };
}

interface BuildPositionChartDataParams {
  sortedLegal: AssetItem[];
  sortedPrice: AssetItem[];
  metric: ChartMetricId;
  view: ChartViewId;
  isFiz: boolean;
}

const buildPositionChartData = ({
  sortedLegal,
  sortedPrice,
  metric,
  view,
  isFiz,
}: BuildPositionChartDataParams) => {
  const legalSeriesConfigs = getLegalSeriesConfigs(metric, view);
  const priceColors = getPriceLineColors(view);
  const legalSeries: ChartLegalSeriesItem[] = [];
  const series: ChartLineSeries[] = [];
  const tooltipSeries: ChartTooltipSeries[] = [];
  let leftMin = Infinity;
  let leftMax = -Infinity;

  legalSeriesConfigs.forEach((config) => {
    const values: number[] = [];
    const points: ChartPoint[] = [];

    sortedLegal.forEach((item) => {
      const rawValue = config.getValue(item.value);
      values.push(rawValue);
      const shiftedValue = shiftChartValue(rawValue);
      if (shiftedValue < leftMin) leftMin = shiftedValue;
      if (shiftedValue > leftMax) leftMax = shiftedValue;
      points.push({
        timestamp: parseChartMoment(item.moment),
        value: shiftedValue,
      });
    });

    const latestValue = values.at(-1);
    const lineSeries: ChartLineSeries = {
      id: config.id,
      name: config.id === 'pure_position' ? 'Pure' : config.id,
      color: config.color,
      points,
      yAxis: 'left',
      latestValue,
    };

    series.push(lineSeries);
    legalSeries.push({
      id: config.id,
      name: config.name,
      color: config.color,
      latestValue,
    });
    tooltipSeries.push({
      id: config.id,
      name: getLegalSeriesLabel(config.name, isFiz, metric),
      color: config.color,
      points,
      formatValue: (value) => toRealChartValue(value).toLocaleString('ru-RU'),
    });
  });

  const priceValues = sortedPrice.map((item) => getChartPriceValue(item.value));
  const pricePoints = sortedPrice.map((item) => ({
    timestamp: parseChartMoment(item.moment),
    value: getChartPriceValue(item.value),
  }));
  const latestPrice =
    priceValues.at(-1) ?? undefined;
  const priceSeries: ChartLineSeries = {
    id: 'price',
    name: 'Price',
    color: priceColors.line,
    points: pricePoints,
    yAxis: 'right',
    step: 'end',
    latestValue: latestPrice,
  };

  series.push(priceSeries);
  tooltipSeries.push({
    id: 'price',
    name: 'Фьючерс',
    color: priceColors.line,
    points: pricePoints,
    formatValue: (value) => value.toLocaleString('ru-RU'),
  });

  const timelinePoints =
    pricePoints.length > 0
      ? pricePoints
      : series.flatMap((item) => item.points);
  const xRange = getXRange(timelinePoints);
  const periodInMilliseconds = xRange.max - xRange.min;

  const markLines = [
    ...series
      .filter((item) => item.yAxis === 'left')
      .map((item) => buildLatestMarkLine(item, 'start', '#0F1115'))
      .filter((item): item is ChartMarkLine => item !== null),
    buildLatestMarkLine(priceSeries, 'end', priceColors.labelText),
  ].filter((item): item is ChartMarkLine => item !== null);

  return {
    chartData: {
      periodInMilliseconds,
      xRange,
      leftYAxis: {
        ...getYAxisScaleFromShiftedRange(leftMin, leftMax),
        formatLabel: formatChartAxisValue,
      },
      rightYAxis: {
        ...getPriceYAxisScale(priceValues),
        formatLabel: (value: number) => value.toLocaleString('ru-RU'),
      },
      series,
      markLines,
      tooltipSeries,
    } satisfies ChartSkiaData,
    legalSeries,
    priceColor: priceColors.line,
    latestPrice,
  };
};

interface BuildSignalsChartDataParams {
  sortedRsi: RsiReportItem[];
  selectedAsset?: Asset;
  isFiz: boolean;
}

const buildSignalsChartData = ({
  sortedRsi,
  selectedAsset,
  isFiz,
}: BuildSignalsChartDataParams) => {
  const validRsiItems = sortedRsi.filter((item) => item.value != null);
  const latestRsi = validRsiItems.at(-1)?.value ?? undefined;
  const points = mapPoints(
    validRsiItems.map((item) => ({moment: item.moment, value: item.value})),
  );
  const {overbought, oversold} = getAssetRsiThresholds(selectedAsset, isFiz);
  const seriesName = `Сигнал (${isFiz ? 'Физ. лица' : 'Юр. лица'})`;
  const xRange = getXRange(points);
  const rsiSeries: ChartLineSeries = {
    id: 'rsi',
    name: seriesName,
    color: CHART_SIGNAL_COLORS.neutral,
    points,
    yAxis: 'left',
    latestValue: latestRsi,
    coloredSegments: buildColoredSegments(points, (point) =>
      getRsiSignalColor(point.value, overbought, oversold),
    ),
  };

  return {
    chartData: {
      periodInMilliseconds: xRange.max - xRange.min,
      xRange,
      leftYAxis: {
        ...getRsiYAxisScale(points.map((item) => item.value)),
        formatLabel: (value: number) => Math.round(value).toString(),
      },
      series: [rsiSeries],
      markLines: [
        {
          y: oversold,
          yAxis: 'left',
          color: CHART_SIGNAL_COLORS.fail,
          labelBackground: CHART_SIGNAL_COLORS.fail,
          label: formatSignalThresholdLabel(oversold),
          labelPosition: 'start',
          labelTextColor: '#FFFFFF',
          labelBorderRadius: [0, 8, 8, 0],
          dashed: true,
        },
        {
          y: overbought,
          yAxis: 'left',
          color: CHART_SIGNAL_COLORS.success,
          labelBackground: CHART_SIGNAL_COLORS.success,
          label: formatSignalThresholdLabel(overbought),
          labelPosition: 'start',
          labelTextColor: '#FFFFFF',
          labelBorderRadius: [0, 8, 8, 0],
          dashed: true,
        },
      ],
      tooltipLayout: 'simple',
      tooltipSeries: [
        {
          id: 'rsi',
          name: seriesName,
          color: CHART_SIGNAL_COLORS.neutral,
          points,
          formatValue: (value) =>
            value.toLocaleString('ru-RU', {
              maximumFractionDigits: Number.isInteger(value) ? 0 : 2,
            }),
          getColor: (value) => getRsiSignalColor(value, overbought, oversold),
        },
      ],
    } satisfies ChartSkiaData,
    legalSeries: [] as ChartLegalSeriesItem[],
    priceColor: '#8085FF',
    latestPrice: undefined,
    latestRsi,
    signalThresholds: {overbought, oversold},
  };
};

interface BuildAssetPriceChartDataParams {
  sortedPriceReport: PriceReportItem[];
  selectedAsset?: Asset;
}

const buildAssetPriceChartData = ({
  sortedPriceReport,
  selectedAsset,
}: BuildAssetPriceChartDataParams) => {
  const pricePoints = mapPoints(
    sortedPriceReport.map((item) => ({moment: item.moment, value: item.value})),
  );
  const rsiPoints = sortedPriceReport.map((item) => item.rsi);
  const {overbought, oversold} = getAssetRsiThresholds(selectedAsset, false);
  const latestPrice =
    pricePoints.at(-1)?.value ?? selectedAsset?.price?.value ?? undefined;
  const xRange = getXRange(pricePoints);
  const priceYAxisScale = getPriceYAxisScale(pricePoints.map((item) => item.value));
  const priceRange = priceYAxisScale.max - priceYAxisScale.min;
  const priceSeries: ChartLineSeries = {
    id: 'price',
    name: 'Фьючерс',
    color: '#8085FF',
    points: pricePoints,
    yAxis: 'left',
    latestValue: latestPrice,
    coloredSegments: buildColoredSegments(pricePoints, (_point, index) =>
      getRsiSignalColor(rsiPoints[index] ?? 0, overbought, oversold),
    ),
  };

  return {
    chartData: {
      periodInMilliseconds: xRange.max - xRange.min,
      xRange,
      leftYAxis: {
        ...priceYAxisScale,
        formatLabel: (value: number) => {
          if (priceRange < 1) {
            return value.toFixed(2);
          }

          return value.toLocaleString('ru-RU', {
            minimumFractionDigits: 0,
            maximumFractionDigits: priceRange < 10 ? 2 : 0,
          });
        },
      },
      series: [priceSeries],
      markLines: [],
      tooltipSeries: [
        {
          id: 'price',
          name: 'Фьючерс',
          color: '#8085FF',
          points: pricePoints,
          formatValue: (value) =>
            value.toLocaleString('ru-RU', {
              maximumFractionDigits: Number.isInteger(value) ? 0 : 2,
            }),
        },
      ],
    } satisfies ChartSkiaData,
    legalSeries: [] as ChartLegalSeriesItem[],
    priceColor: '#8085FF',
    latestPrice,
    signalThresholds: {overbought, oversold},
  };
};

export interface BuildSkiaChartDataParams {
  assetsLegal: AssetItem[];
  assetsPrice: AssetItem[];
  assetsRsi: RsiReportItem[];
  assetsPriceReport: PriceReportItem[];
  selectedAsset?: Asset;
  view: ChartViewId;
  metric: ChartMetricId;
  isFiz?: boolean;
}

export const buildSkiaChartData = ({
  assetsLegal,
  assetsPrice,
  assetsRsi,
  assetsPriceReport,
  selectedAsset,
  view,
  metric,
  isFiz = false,
}: BuildSkiaChartDataParams): BuildSkiaChartDataResult => {
  if (view === 'signals') {
    return buildSignalsChartData({
      sortedRsi: sortChartItemsByMoment(assetsRsi),
      selectedAsset,
      isFiz,
    });
  }

  if (view === 'asset-price') {
    return buildAssetPriceChartData({
      sortedPriceReport: sortChartItemsByMoment(assetsPriceReport),
      selectedAsset,
    });
  }

  return buildPositionChartData({
    sortedLegal: sortChartItemsByMoment(assetsLegal),
    sortedPrice: sortChartItemsByMoment(assetsPrice),
    metric,
    view,
    isFiz,
  });
};

export const formatChartTimestampLabel = (
  timestamp: number,
  periodInMilliseconds: number,
) => formatChartXAxisLabel(String(timestamp), periodInMilliseconds);
