import type {AssetItem, PriceReportItem, RsiReportItem} from '@services/assets/types';
import type {ChartDataCacheEntry} from './chartDataCache';

export const emptyChartData = (): ChartDataCacheEntry => ({
  assetsLegal: [],
  assetsPrice: [],
  assetsRsi: [],
  assetsPriceReport: [],
});

export const applyChartData = (
  data: ChartDataCacheEntry,
  setters: {
    setAssetsLegal: (value: AssetItem[]) => void;
    setAssetsPrice: (value: AssetItem[]) => void;
    setAssetsRsi: (value: RsiReportItem[]) => void;
    setAssetsPriceReport: (value: PriceReportItem[]) => void;
  },
) => {
  setters.setAssetsLegal(data.assetsLegal);
  setters.setAssetsPrice(data.assetsPrice);
  setters.setAssetsRsi(data.assetsRsi);
  setters.setAssetsPriceReport(data.assetsPriceReport);
};

export const clearChartData = (setters: {
  setAssetsLegal: (value: AssetItem[]) => void;
  setAssetsPrice: (value: AssetItem[]) => void;
  setAssetsRsi: (value: RsiReportItem[]) => void;
  setAssetsPriceReport: (value: PriceReportItem[]) => void;
}) => {
  applyChartData(emptyChartData(), setters);
};
