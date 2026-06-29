import {api, type FetchOptions} from '@services/api';
import type {
  ApiResponse,
  AssetItem,
  AssetsData,
  AssetsResponse,
  GetAssetsParams,
  PriceReportItem,
  RsiReportItem,
} from './types';

const createAssetFetcher = (endpointSuffix: string) => {
  return async (
    {
      from,
      to,
      interval,
      type,
      iz_fiz,
      additional_report_type,
      id,
    }: GetAssetsParams,
    options?: Pick<FetchOptions, 'authTokens'>,
  ): Promise<AssetItem[]> => {
    const response = await api.get<ApiResponse<AssetItem[]>>(
      `/assets/${id}${endpointSuffix}`,
      {
        params: {from, to, interval, type, iz_fiz, additional_report_type},
        authTokens: options?.authTokens,
      },
    );
    return response.data.data;
  };
};

export const serviceAssets = {
  getAssets: async (
    type: string,
    search: string = '',
    options?: Pick<FetchOptions, 'authTokens'>,
  ): Promise<AssetsData> => {
    const response = await api.get<AssetsResponse>('/assets', {
      params: {search, type, isin: ''},
      authTokens: options?.authTokens,
    });
    return response.data.data;
  },
  getAssetsLegal: createAssetFetcher('/legal'),
  getAssetsIndividual: createAssetFetcher('/individual'),
  getAssetsPrice: createAssetFetcher('/price'),
  getAssetsRsi: async (
    params: GetAssetsParams,
    options?: Pick<FetchOptions, 'authTokens'>,
  ): Promise<RsiReportItem[]> => {
    const response = await api.get<ApiResponse<RsiReportItem[]>>(
      `/assets/${params.id}/rsi`,
      {
        params: {
          from: params.from,
          to: params.to,
          interval: params.interval,
          type: params.type,
          iz_fiz: params.iz_fiz,
        },
        authTokens: options?.authTokens,
      },
    );
    return response.data.data;
  },
  getAssetsPriceReport: async (
    params: GetAssetsParams,
    options?: Pick<FetchOptions, 'authTokens'>,
  ): Promise<PriceReportItem[]> => {
    const response = await api.get<ApiResponse<PriceReportItem[]>>(
      `/assets/${params.id}/price`,
      {
        params: {
          from: params.from,
          to: params.to,
          interval: params.interval,
          type: params.type,
          iz_fiz: params.iz_fiz,
        },
        authTokens: options?.authTokens,
      },
    );
    return response.data.data;
  },
};
