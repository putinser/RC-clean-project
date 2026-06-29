import type {Asset} from '@services/assets/types';

export const getAssetRsiThresholds = (
  selectedAsset: Asset | undefined,
  isFiz: boolean,
) => {
  const thresholds = isFiz ? selectedAsset?.rsi?.fiz : selectedAsset?.rsi?.yur;

  return {
    overbought: thresholds?.overbought ?? 70,
    oversold: thresholds?.oversold ?? 30,
  };
};
