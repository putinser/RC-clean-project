import type { Asset } from '@services/assets/types';

export type SignalsAssetTypeId = 'all' | Asset['type'];

export type SignalTypeId =
  | 'all'
  | 'legal-overbought'
  | 'legal-oversold'
  | 'individual-overbought'
  | 'individual-oversold';

export type SignalsState = {
  available: Asset[];
  unavailable: Asset[];
  isLoading: boolean;
};

export interface SignalsControllerProps {
  selectedAssetId?: number | null;
  selectedIsin?: string | null;
  selectedSignalType?: SignalTypeId | null;
  onClearSelectedAsset?: () => void;
}
