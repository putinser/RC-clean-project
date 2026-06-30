export const isTabletLayout = (width: number, height: number) =>
  Math.min(width, height) >= 600;

export const getChartYAxisScale = (width: number) =>
  width >= 600
    ? {fontSize: 12, lineHeight: 20, labelHeight: 20}
    : {fontSize: 10, lineHeight: 14, labelHeight: 14};
