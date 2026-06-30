import type { Asset } from '@services/assets/types';

export type AssetChangeDirection = 'up' | 'down' | 'flat';

export function formatAssetPrice(value?: number | null) {
  if (value === null || value === undefined) {
    return 'NN';
  }

  return new Intl.NumberFormat('ru-RU', {
    maximumFractionDigits: 4,
  }).format(value);
}

export function formatAssetChange(value?: number | null, suffix = '') {
  if (value === null || value === undefined) {
    return null;
  }

  const formatted = new Intl.NumberFormat('ru-RU', {
    maximumFractionDigits: 2,
    signDisplay: 'always',
  }).format(value);

  return `${formatted}${suffix}`;
}

export function getAssetChangeDirection(asset: Asset): AssetChangeDirection {
  const value = asset.price?.daily_changes_value ?? 0;
  const percent = asset.price?.daily_changes_perc ?? 0;

  if (value > 0 || percent > 0) {
    return 'up';
  }

  if (value < 0 || percent < 0) {
    return 'down';
  }

  return 'flat';
}
