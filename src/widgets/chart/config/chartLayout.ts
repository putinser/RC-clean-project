export type ChartLayoutId = 'single' | 'horizontal' | 'vertical';

export const defaultChartLayout: ChartLayoutId = 'single';

export const getChartLayoutPanelCount = (layout: ChartLayoutId): number => {
  switch (layout) {
    case 'single':
      return 1;
    case 'horizontal':
    case 'vertical':
      return 2;
  }
};

export const resolveLayoutAfterRemove = (
  layout: ChartLayoutId,
): ChartLayoutId => {
  if (layout === 'horizontal' || layout === 'vertical') {
    return 'single';
  }
  return 'single';
};
