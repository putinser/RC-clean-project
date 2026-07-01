export type ChartPoint = {
  timestamp: number;
  value: number;
};

export type ChartColoredSegment = {
  color: string;
  points: ChartPoint[];
};

export type ChartLineSeries = {
  id: string;
  name: string;
  color: string;
  points: ChartPoint[];
  yAxis: 'left' | 'right';
  step?: 'end';
  latestValue?: number;
  coloredSegments?: ChartColoredSegment[];
};

export type ChartMarkLine = {
  y: number;
  yAxis: 'left' | 'right';
  color: string;
  label?: string;
  labelPosition?: 'start' | 'end';
  labelTextColor?: string;
  dashed?: boolean;
};

export type ChartYAxisConfig = {
  min: number;
  max: number;
  interval: number;
  formatLabel: (value: number) => string;
};

export type ChartTooltipSeries = {
  id: string;
  name: string;
  color: string;
  points: ChartPoint[];
  formatValue: (value: number) => string;
};

export type ChartSkiaData = {
  periodInMilliseconds: number;
  xRange: {min: number; max: number};
  leftYAxis: ChartYAxisConfig;
  rightYAxis?: ChartYAxisConfig;
  series: ChartLineSeries[];
  markLines: ChartMarkLine[];
  tooltipSeries: ChartTooltipSeries[];
};

export type ChartPlotLayout = {
  left: number;
  top: number;
  width: number;
  height: number;
  leftGutter: number;
  rightGutter: number;
};

export type ChartRenderedPath = {
  path: ReturnType<typeof import('@shopify/react-native-skia').Skia.Path.Make>;
  color: string;
  strokeWidth: number;
};

export type ChartRenderedMarkLine = {
  y: number;
  color: string;
  dashed: boolean;
  label?: string;
  labelPosition: 'start' | 'end';
  labelY: number;
  labelBackground: string;
  labelTextColor: string;
};

export type ChartAxisTick = {
  value: number;
  label: string;
  x?: number;
  y?: number;
};

export type ChartTooltipEntry = {
  text: string;
  color?: string;
};

export type ChartTooltipState = {
  x: number;
  y: number;
  lines: ChartTooltipEntry[];
};
