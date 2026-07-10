import { useEffect, useMemo, useState } from 'react';
import { useFavoritesStore } from '@entities/favorite';
import { useUserStore } from '@entities/user';
import { serviceAssets } from '@services/assets';
import {
  type AssetTypeId,
  EassetTypes,
} from '@widgets/chart/config/assetTypes';
import { filterAssetsBySignal } from '../lib/helpers';
import type { SignalsAssetTypeId, SignalsState, SignalTypeId } from './types';

interface UseSignalsParams {
  selectedAssetId?: number | null;
  selectedIsin?: string | null;
  selectedSignalType?: SignalTypeId | null;
  onClearSelectedAsset?: () => void;
}

export const useSignals = ({
  selectedAssetId,
  selectedIsin,
  selectedSignalType,
  onClearSelectedAsset,
}: UseSignalsParams) => {
  const [assetType, setAssetType] = useState<SignalsAssetTypeId>('all');
  const [signalType, setSignalType] = useState<SignalTypeId>(
    selectedSignalType && selectedSignalType !== 'all'
      ? selectedSignalType
      : 'all',
  );
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const favorites = useFavoritesStore(state => state.favorites);
  const fetchFavorites = useFavoritesStore(state => state.fetchFavorites);
  const isAuthorized = useUserStore(state => state.isAuthorized);
  const [assets, setAssets] = useState<SignalsState>({
    available: [],
    unavailable: [],
    isLoading: true,
  });

  useEffect(() => {
    if (selectedSignalType && selectedSignalType !== 'all') {
      setSignalType(selectedSignalType);
    }
  }, [selectedSignalType]);

  useEffect(() => {
    if (isAuthorized) {
      fetchFavorites();
    } else {
      setOnlyFavorites(false);
    }
  }, [isAuthorized, fetchFavorites]);

  useEffect(() => {
    let isCancelled = false;

    const fetchAssets = async () => {
      try {
        setAssets(prev => ({ ...prev, isLoading: true }));
        const data = await serviceAssets.getAssets(
          assetType === 'all' ? '' : assetType,
        );

        if (!isCancelled) {
          setAssets({
            available: data.avalible,
            unavailable: data.unavalible,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error('Failed to fetch signal assets:', error);
        if (!isCancelled) {
          setAssets({
            available: [],
            unavailable: [],
            isLoading: false,
          });
        }
      }
    };

    fetchAssets();

    return () => {
      isCancelled = true;
    };
  }, [assetType]);

  const filteredAssets = useMemo(() => {
    let signalAssets = filterAssetsBySignal(assets.available, signalType);

    if (onlyFavorites) {
      signalAssets = signalAssets.filter(asset => favorites.includes(asset.id));
    }

    if (selectedAssetId) {
      return signalAssets.filter(asset => asset.id === selectedAssetId);
    }

    if (selectedIsin) {
      return signalAssets.filter(asset => asset.isin === selectedIsin);
    }

    return signalAssets;
  }, [
    assets.available,
    selectedAssetId,
    selectedIsin,
    signalType,
    onlyFavorites,
    favorites,
  ]);

  const filteredUnavailableAssets = useMemo(() => {
    let unavailableAssets = assets.unavailable;

    if (onlyFavorites) {
      unavailableAssets = unavailableAssets.filter(asset =>
        favorites.includes(asset.id),
      );
    }

    if (selectedAssetId) {
      return unavailableAssets.filter(asset => asset.id === selectedAssetId);
    }

    if (selectedIsin) {
      return unavailableAssets.filter(asset => asset.isin === selectedIsin);
    }

    return unavailableAssets;
  }, [
    assets.unavailable,
    selectedAssetId,
    selectedIsin,
    onlyFavorites,
    favorites,
  ]);

  const handleAssetTypeChange = (value: string) => {
    onClearSelectedAsset?.();
    setAssetType(value as SignalsAssetTypeId);
  };

  const handleReset = () => {
    setAssetType('all');
    setSignalType('all');
    setOnlyFavorites(false);
    onClearSelectedAsset?.();
  };

  return {
    assetType,
    signalType,
    setSignalType,
    onlyFavorites,
    setOnlyFavorites,
    assets,
    filteredAssets,
    filteredUnavailableAssets,
    handleAssetTypeChange,
    handleReset,
  };
};

export const signalsAssetTypeOptions: {
  id: SignalsAssetTypeId;
  label1: string;
}[] = [
  { id: 'all', label1: 'Все активы' },
  { id: EassetTypes.STOCK, label1: 'Акции' },
  { id: EassetTypes.CURRENCY, label1: 'Валютные пары' },
  { id: EassetTypes.PRODUCT, label1: 'Товары' },
  { id: EassetTypes.INDEX, label1: 'Индексы' },
  { id: EassetTypes.OTHER, label1: 'Другие' },
];

export const assetTypeLabel = (type: AssetTypeId): string =>
  signalsAssetTypeOptions.find(opt => opt.id === type)?.label1 ?? type;
