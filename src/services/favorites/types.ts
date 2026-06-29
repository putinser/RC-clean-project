import type {Asset} from '@services/assets/types';

export type FavoritesResponse = {
  success: boolean;
  data: number[] | null;
  error?: unknown;
};

export type FavoritesAssetsResponse = {
  success: boolean;
  data: Asset[] | null;
  error?: unknown;
};
