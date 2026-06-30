import type { Asset, AssetRsiValue } from '@services/assets/types';
import {
  SIGNAL_COLOR_NEUTRAL,
  SIGNAL_COLOR_OVERBOUGHT,
  SIGNAL_COLOR_OVERSOLD,
} from '../config/constants';
import type { SignalTypeId } from '../model/types';

export function getRsiColor(rsi?: AssetRsiValue | null): string {
  if (!rsi) {
    return SIGNAL_COLOR_NEUTRAL;
  }
  if (rsi.status === 'overbought') {
    return SIGNAL_COLOR_OVERBOUGHT;
  }
  if (rsi.status === 'oversold') {
    return SIGNAL_COLOR_OVERSOLD;
  }
  return rsi.value >= 50 ? SIGNAL_COLOR_OVERBOUGHT : SIGNAL_COLOR_OVERSOLD;
}

export function getAssetSignalColor(asset?: Asset | null): string {
  if (!asset) {
    return SIGNAL_COLOR_NEUTRAL;
  }
  const values = [asset.rsi?.yur, asset.rsi?.fiz];
  const signal = values.find(
    rsi => rsi?.status === 'overbought' || rsi?.status === 'oversold',
  );
  if (signal?.status === 'overbought') {
    return SIGNAL_COLOR_OVERBOUGHT;
  }
  if (signal?.status === 'oversold') {
    return SIGNAL_COLOR_OVERSOLD;
  }
  return SIGNAL_COLOR_NEUTRAL;
}

export function filterAssetsBySignal(
  assets: Asset[],
  signalType: SignalTypeId,
): Asset[] {
  switch (signalType) {
    case 'legal-overbought':
      return assets.filter(asset => asset.rsi?.yur?.status === 'overbought');
    case 'legal-oversold':
      return assets.filter(asset => asset.rsi?.yur?.status === 'oversold');
    case 'individual-overbought':
      return assets.filter(asset => asset.rsi?.fiz?.status === 'overbought');
    case 'individual-oversold':
      return assets.filter(asset => asset.rsi?.fiz?.status === 'oversold');
    default:
      return assets;
  }
}
