import {useState} from 'react';
import {
  type ChartMetricId,
  defaultChartMetric,
  getMetricOptions,
} from '../config/chartMetric';
import {type ChartViewId, defaultChartView} from '../config/chartView';
import {useChartInterval} from './useInterval';

export const useChartControls = () => {
  const intervalState = useChartInterval();
  const [view, setView] = useState<ChartViewId>(defaultChartView);
  const [metric, setMetric] = useState<ChartMetricId>(defaultChartMetric);

  return {
    ...intervalState,
    view,
    changeView: (id: string) => {
      setView(id as ChartViewId);
      setMetric(defaultChartMetric);
    },
    metric,
    changeMetric: (id: string) => setMetric(id as ChartMetricId),
    metricOptions: getMetricOptions(view),
  };
};
