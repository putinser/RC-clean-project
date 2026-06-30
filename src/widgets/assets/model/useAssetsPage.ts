import { useEffect, useMemo, useState } from 'react';
import { useFavoritesStore } from '@entities/favorite';
import { useUserStore } from '@entities/user';
import { serviceAssets } from '@services/assets';
import {
  type AssetTypeId,
  EassetTypes,
} from '@widgets/chart/config/assetTypes';
import type { AssetsState } from './types';

interface UseAssetsPageParams {
  selectedAssetId?: number | null;
  onClearSelectedAsset?: () => void;
}

export const useAssetsPage = ({
  selectedAssetId,
  onClearSelectedAsset,
}: UseAssetsPageParams) => {
  const [assetType, setAssetType] = useState<AssetTypeId>(EassetTypes.STOCK);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const favorites = useFavoritesStore(state => state.favorites);
  const fetchFavorites = useFavoritesStore(state => state.fetchFavorites);
  const isAuthorized = useUserStore(state => state.isAuthorized);
  const [assets, setAssets] = useState<AssetsState>({
    available: [],
    unavailable: [],
    isLoading: true,
  });

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery.trim());
    }, 350);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

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
          debouncedSearchQuery ? '' : assetType,
          debouncedSearchQuery,
        );

        if (!isCancelled) {
          setAssets({
            available: data.avalible,
            unavailable: data.unavalible,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error('Failed to fetch assets page:', error);
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
  }, [assetType, debouncedSearchQuery]);

  const filteredAvailableAssets = useMemo(() => {
    let result = assets.available;

    if (onlyFavorites) {
      result = result.filter(asset => favorites.includes(asset.id));
    }

    if (selectedAssetId) {
      return result.filter(asset => asset.id === selectedAssetId);
    }

    return result;
  }, [assets.available, favorites, onlyFavorites, selectedAssetId]);

  const filteredUnavailableAssets = useMemo(() => {
    if (selectedAssetId) {
      return assets.unavailable.filter(asset => asset.id === selectedAssetId);
    }

    return assets.unavailable;
  }, [assets.unavailable, selectedAssetId]);

  const handleAssetTypeChange = (value: string) => {
    onClearSelectedAsset?.();
    setSearchQuery('');
    setAssetType(value as AssetTypeId);
  };

  const handleSearchChange = (value: string) => {
    onClearSelectedAsset?.();
    setSearchQuery(value);
  };

  const handleReset = () => {
    setAssetType(EassetTypes.STOCK);
    setSearchQuery('');
    setOnlyFavorites(false);
    onClearSelectedAsset?.();
  };

  return {
    assetType,
    searchQuery,
    onlyFavorites,
    setOnlyFavorites,
    assets,
    filteredAvailableAssets,
    filteredUnavailableAssets,
    handleAssetTypeChange,
    handleSearchChange,
    handleReset,
  };
};
