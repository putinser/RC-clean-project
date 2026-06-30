import type { Asset } from '@services/assets/types';

export type ScreenerAccessStatus =
  | 'checking'
  | 'available'
  | 'unauthorized'
  | 'forbidden'
  | 'unavailable'
  | 'error';

export type ScreenerState = {
  data: import('@services/screener/types').ScreenerListData | null;
  isLoading: boolean;
  isLoadingMore: boolean;
  accessStatus: ScreenerAccessStatus;
  error: string | null;
};

export type ScreenerPresetsState = {
  system: import('@services/screener/types').ScreenerSystemPreset[];
  user: import('@services/screener/types').ScreenerPreset[];
  isLoading: boolean;
  isSaving: boolean;
};

export interface ScreenerControllerProps {
  selectedAssetId?: number | null;
  selectedAssetName?: string | null;
  onClearSelectedAsset?: () => void;
}

export type { Asset };
