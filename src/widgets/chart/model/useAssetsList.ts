import {useEffect, useMemo, useState} from 'react';
import {
  fetchAssetsList,
  getAssetsListCacheKey,
  getCachedAssetsList,
} from '@entities/asset';
import {useUserStore} from '@entities/user';
import type {Asset} from '@services/assets/types';
import {type AssetTypeId, EassetTypes} from '../config/assetTypes';

interface AssetsState {
  available: Asset[];
  unavailable: Asset[];
  isLoading: boolean;
}

export const useAssetsList = (
  assetType: AssetTypeId = EassetTypes.STOCK,
  selectedAssetId: string | null,
  searchQuery: string = '',
) => {
  const isAuthorized = useUserStore((state) => state.isAuthorized);
  const assetsListKey = getAssetsListCacheKey(assetType, isAuthorized);
  const cachedAssetsList = searchQuery ? undefined : getCachedAssetsList(assetsListKey);

  const [assets, setAssets] = useState<AssetsState>(() => ({
    available: cachedAssetsList?.available ?? [],
    unavailable: cachedAssetsList?.unavailable ?? [],
    isLoading: !cachedAssetsList,
  }));
  const [selectedAsset, setSelectedAsset] = useState<Asset | undefined>(
    undefined,
  );

  const resolvedSelectedAssetId = useMemo(() => {
    if (selectedAssetId) {
      return selectedAssetId;
    }
    if (assets.available.length > 0) {
      return String(assets.available[0].id);
    }
    return null;
  }, [selectedAssetId, assets.available]);

  useEffect(() => {
    const found =
      assets.available.find((a) => String(a.id) === resolvedSelectedAssetId) ||
      assets.unavailable.find((a) => String(a.id) === resolvedSelectedAssetId);
    if (found) {
      setSelectedAsset(found);
      return;
    }
    setSelectedAsset(undefined);
  }, [assets.available, assets.unavailable, resolvedSelectedAssetId]);

  useEffect(() => {
    let isCancelled = false;

    const loadAssets = async () => {
      try {
        if (!getCachedAssetsList(getAssetsListCacheKey(assetType, isAuthorized))) {
          setAssets((prev) => ({...prev, isLoading: true}));
        }

        const data = await fetchAssetsList(assetType, isAuthorized, searchQuery);

        if (!isCancelled) {
          setAssets({
            available: data.available,
            unavailable: data.unavailable,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error('Failed to fetch assets:', error);
        if (!isCancelled) {
          setAssets({
            available: [],
            unavailable: [],
            isLoading: false,
          });
        }
      }
    };

    loadAssets();

    return () => {
      isCancelled = true;
    };
  }, [assetType, isAuthorized, searchQuery]);

  return {
    availableAssets: assets.available,
    unavailableAssets: assets.unavailable,
    isLoading: assets.isLoading,
    selectedAsset,
    resolvedSelectedAssetId,
  };
};
