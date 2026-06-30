import type { Asset } from '@services/assets/types';

export type AssetsState = {
  available: Asset[];
  unavailable: Asset[];
  isLoading: boolean;
};

export interface AssetsControllerProps {
  selectedAssetId?: number | null;
  onClearSelectedAsset?: () => void;
}
