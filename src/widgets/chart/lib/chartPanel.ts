import {type AssetTypeId, EassetTypes} from '../config/assetTypes';
import {
  type ChartIntervalId,
  defaultChartInterval,
} from '../config/chartInterval';
import {
  type ChartMetricId,
  defaultChartMetric,
} from '../config/chartMetric';
import {
  type ChartPeriodId,
  defaultChartPeriod,
} from '../config/chartPeriod';
import {type ChartViewId, defaultChartView} from '../config/chartView';

export interface ChartPanelState {
  id: string;
  assetType: AssetTypeId;
  selectedAssetId: string | null;
  view: ChartViewId;
  metric: ChartMetricId;
  interval: ChartIntervalId;
  period: ChartPeriodId;
  isFiz: boolean;
  showPrice: boolean;
}

let panelIdCounter = 0;

export const createChartPanelState = (
  overrides: Partial<ChartPanelState> = {},
): ChartPanelState => {
  panelIdCounter += 1;

  return {
    id: `chart-panel-${panelIdCounter}`,
    assetType: EassetTypes.STOCK,
    selectedAssetId: null,
    view: defaultChartView,
    metric: defaultChartMetric,
    interval: defaultChartInterval,
    period: defaultChartPeriod,
    isFiz: false,
    showPrice: true,
    ...overrides,
  };
};
