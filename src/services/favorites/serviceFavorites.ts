import {api, type FetchOptions} from '@services/api';
import type {FavoritesAssetsResponse, FavoritesResponse} from './types';

export const serviceFavorites = {
  getFavorites: async (
    options?: Pick<FetchOptions, 'authTokens'>,
  ): Promise<number[]> => {
    const response = await api.get<FavoritesResponse>('/favorites', {
      authTokens: options?.authTokens,
    });
    return response.data.data ?? [];
  },

  getFavoritesAssets: async (
    options?: Pick<FetchOptions, 'authTokens'>,
  ): Promise<NonNullable<FavoritesAssetsResponse['data']>> => {
    const response = await api.get<FavoritesAssetsResponse>(
      '/assets/favorites',
      {
        authTokens: options?.authTokens,
      },
    );
    return response.data.data ?? [];
  },

  addFavorite: async (
    assetId: number,
    options?: Pick<FetchOptions, 'authTokens'>,
  ): Promise<number[]> => {
    const response = await api.post<FavoritesResponse>(
      '/favorites',
      {asset_id: assetId},
      {authTokens: options?.authTokens},
    );
    return response.data.data ?? [];
  },

  deleteFavorite: async (
    assetId: number,
    options?: Pick<FetchOptions, 'authTokens'>,
  ): Promise<number[]> => {
    const response = await api.delete<FavoritesResponse>('/favorites', {
      params: {asset_id: assetId},
      authTokens: options?.authTokens,
    });
    return response.data.data ?? [];
  },
};
