import type {ChartViewId} from '../config/chartView';
import type {ChartPriceLineColors} from './chartView.types';

export const getPriceLineColors = (view: ChartViewId): ChartPriceLineColors => ({
  line: view === 'buyers-sellers' ? '#FFFFFF' : '#8085FF',
  labelText: view === 'buyers-sellers' ? '#0F1115' : '#FFFFFF',
});
