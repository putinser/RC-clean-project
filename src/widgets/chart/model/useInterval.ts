import {useState} from 'react';
import {
  type ChartIntervalId,
  defaultChartInterval,
} from '../config/chartInterval';

export const useChartInterval = (
  initialInterval: ChartIntervalId = defaultChartInterval,
) => {
  const [interval, setInterval] = useState<ChartIntervalId>(initialInterval);
  const handleInterval = (nextInterval: ChartIntervalId) => {
    setInterval(nextInterval);
  };
  return {
    interval,
    handleInterval,
  };
};
