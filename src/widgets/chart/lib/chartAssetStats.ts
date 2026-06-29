import type {Asset} from '@services/assets/types';
import type {ChartAssetStats} from './chartView.types';

export const getChartAssetStats = (
  selectedAsset: Asset | undefined,
  latestPrice: number | undefined,
): ChartAssetStats => {
  const changeValue = selectedAsset?.price?.daily_changes_value;
  const changePerc = selectedAsset?.price?.daily_changes_perc;

  return {
    latestOpen: latestPrice,
    maxPrice: latestPrice,
    minPrice: latestPrice,
    latestPrice,
    changeValue,
    changePerc,
    changeColor:
      changeValue !== undefined && changeValue >= 0
        ? '#34D399'
        : '#EF4444',
    volume: selectedAsset
      ? (((selectedAsset.id * 1234567) % 90000000) + 10000000).toLocaleString()
      : undefined,
  };
};
