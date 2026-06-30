import type {
  ScreenerChangeBlock,
  ScreenerListItem,
  ScreenerSortMetric,
} from '@services/screener/types';
import type { ScreenerAssetMetadata } from '@services/screener/types';

export function formatPercent(
  value?: number | null,
  signDisplay: 'auto' | 'exceptZero' = 'auto',
) {
  if (value === null || value === undefined) {
    return 'NN';
  }

  return `${new Intl.NumberFormat('ru-RU', {
    maximumFractionDigits: 1,
    signDisplay,
  }).format(value)}%`;
}

export function formatPrice(value?: number | null) {
  if (value === null || value === undefined) {
    return 'NN';
  }

  return new Intl.NumberFormat('ru-RU', {
    maximumFractionDigits: 4,
  }).format(value);
}

export function formatAssetCode(asset: ScreenerAssetMetadata) {
  return asset.base_code || asset.isin || `#${asset.id}`;
}

export function getChangeBlock(
  item: ScreenerListItem,
  metric: ScreenerSortMetric,
): ScreenerChangeBlock {
  switch (metric) {
    case 'positions_long_change':
      return item.snapshot.positions.change_long;
    case 'positions_short_change':
      return item.snapshot.positions.change_short;
    case 'participants_long_change':
      return item.snapshot.participants.change_long;
    case 'participants_short_change':
      return item.snapshot.participants.change_short;
    case 'net_position_change':
      return item.snapshot.net.position_change;
    case 'net_participants_change':
      return item.snapshot.net.participants_change;
    case 'open_interest_positions_change':
      return item.snapshot.open_interest.positions_change;
    case 'open_interest_participants_change':
      return item.snapshot.open_interest.participants_change;
    default:
      return item.snapshot.positions.change_long;
  }
}

export function getChangeTone(sign: ScreenerChangeBlock['sign']) {
  if (sign === 1) {
    return 'text-[#4ADE80]';
  }
  if (sign === -1) {
    return 'text-[#EF4444]';
  }
  return 'text-white/45';
}

export function getChangeColor(sign: ScreenerChangeBlock['sign']) {
  if (sign === 1) {
    return '#4ADE80';
  }
  if (sign === -1) {
    return '#EF4444';
  }
  return 'rgba(255,255,255,0.45)';
}
