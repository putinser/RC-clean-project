import type {Asset} from '@services/assets/types';
import type {ChartAssetStats} from './chartView.types';

export const getChartAssetStats = (
  selectedAsset: Asset | undefined,
  latestPrice: number | undefined,
): ChartAssetStats => {
  const changeValue = selectedAsset?.price?.daily_changes_value;
  const changePerc = selectedAsset?.price?.daily_changes_perc;
  const price = latestPrice ?? selectedAsset?.price?.value;

  return {
    latestPrice: price,
    changeValue,
    changePerc,
  };
};
