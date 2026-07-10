import {serviceAssets} from '@services/assets';
import type {Asset} from '@services/assets/types';

type AssetsListEntry = {
  available: Asset[];
  unavailable: Asset[];
};

const cache = new Map<string, AssetsListEntry>();
const inflight = new Map<string, Promise<AssetsListEntry>>();

export const getAssetsListCacheKey = (
  assetType: string,
  isAuthorized: boolean,
) => `${assetType}:${isAuthorized}`;

export const getCachedAssetsList = (key: string) => cache.get(key);

export const fetchAssetsList = async (
  assetType: string,
  isAuthorized: boolean,
  searchQuery = '',
): Promise<AssetsListEntry> => {
  if (searchQuery) {
    const data = await serviceAssets.getAssets('', searchQuery);
    return {
      available: data.avalible,
      unavailable: data.unavalible,
    };
  }

  const key = getAssetsListCacheKey(assetType, isAuthorized);
  const cached = cache.get(key);
  if (cached) {
    return cached;
  }

  const pending = inflight.get(key);
  if (pending) {
    return pending;
  }

  const promise = serviceAssets
    .getAssets(assetType)
    .then((data) => {
      const entry = {
        available: data.avalible,
        unavailable: data.unavalible,
      };
      cache.set(key, entry);
      inflight.delete(key);
      return entry;
    })
    .catch((error) => {
      inflight.delete(key);
      throw error;
    });

  inflight.set(key, promise);
  return promise;
};
