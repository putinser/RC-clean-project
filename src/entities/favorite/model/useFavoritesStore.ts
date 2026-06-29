import {create} from 'zustand';
import {storage} from '@shared/lib/storage';
import {STORAGE_KEYS} from '@shared/lib/storageKeys';
import {serviceFavorites} from '@services/favorites';
import {tokenStorage} from '@shared/lib/userStorage';

type FavoritesLoadingStatus = 'initial' | 'loading' | 'loaded';

type FavoritesState = {
  favorites: number[];
  loadingStatus: FavoritesLoadingStatus;
  loadingAssetId: number | null;
  fetchFavorites: (force?: boolean) => Promise<void>;
  toggleFavorite: (assetId: number) => Promise<void>;
  clearFavorites: () => void;
};

function saveFavorites(favorites: number[]): Promise<void> {
  return storage.setItem(STORAGE_KEYS.FAVORITES, favorites);
}

async function loadFavorites(): Promise<number[]> {
  return (await storage.getItem<number[]>(STORAGE_KEYS.FAVORITES)) ?? [];
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: [],
  loadingStatus: 'initial',
  loadingAssetId: null,

  fetchFavorites: async (force = false) => {
    const {loadingStatus} = get();

    if (!force && (loadingStatus === 'loading' || loadingStatus === 'loaded')) {
      return;
    }

    set({loadingStatus: 'loading'});

    try {
      const tokens = await tokenStorage.get();
      const favorites = await serviceFavorites.getFavorites({authTokens: tokens});
      await saveFavorites(favorites);
      set({favorites, loadingStatus: 'loaded'});
    } catch (error) {
      console.error('Failed to fetch favorites:', error);
      set({loadingStatus: 'loaded'});
    }
  },

  toggleFavorite: async (assetId) => {
    const {favorites, loadingAssetId} = get();

    if (loadingAssetId !== null) {
      return;
    }

    const isFavorite = favorites.includes(assetId);
    set({loadingAssetId: assetId});

    try {
      const tokens = await tokenStorage.get();
      const nextFavorites = isFavorite
        ? await serviceFavorites.deleteFavorite(assetId, {authTokens: tokens})
        : await serviceFavorites.addFavorite(assetId, {authTokens: tokens});

      await saveFavorites(nextFavorites);
      set({favorites: nextFavorites});
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    } finally {
      set({loadingAssetId: null});
    }
  },

  clearFavorites: () => {
    storage.removeItem(STORAGE_KEYS.FAVORITES);
    set({favorites: [], loadingStatus: 'initial', loadingAssetId: null});
  },
}));

loadFavorites().then((favorites) => {
  useFavoritesStore.setState({favorites});
});
