import { ApiError, api } from '@services/api';
import type { ScreenerActionResult } from './types';
import type {
  CreateScreenerPresetPayload,
  ScreenerListData,
  ScreenerListParams,
  ScreenerPreset,
  ScreenerSystemPreset,
} from './types';

type AvailabilityResponse = { success: boolean; data: { available: boolean } };
type ListResponse = { success: boolean; data: ScreenerListData };
type SystemPresetsResponse = {
  success: boolean;
  data: { items: ScreenerSystemPreset[] };
};
type PresetsResponse = { success: boolean; data: { items: ScreenerPreset[] } };
type PresetResponse = { success: boolean; data: ScreenerPreset };
type DeletePresetResponse = { success: boolean; data: { deleted: boolean } };

export function toScreenerResult<T>(error: unknown): ScreenerActionResult<T> {
  if (error instanceof ApiError) {
    return {
      success: false,
      data: null,
      status: error.status,
      message: error.message,
    };
  }

  return {
    success: false,
    data: null,
    status: 500,
    message: 'Не удалось выполнить запрос',
  };
}

export const serviceScreener = {
  getAvailability: async (): Promise<ScreenerActionResult<boolean>> => {
    try {
      const response = await api.get<AvailabilityResponse>(
        '/screener/availability',
      );
      return { success: true, data: Boolean(response.data.data?.available) };
    } catch (error) {
      return toScreenerResult(error);
    }
  },

  getList: async (
    params: ScreenerListParams,
  ): Promise<ScreenerActionResult<ScreenerListData>> => {
    try {
      const response = await api.get<ListResponse>('/screener', { params });
      return { success: true, data: response.data.data };
    } catch (error) {
      return toScreenerResult(error);
    }
  },

  getSystemPresets: async (
    params: Pick<ScreenerListParams, 'asset_class' | 'iz_fiz'>,
  ): Promise<ScreenerActionResult<ScreenerSystemPreset[]>> => {
    try {
      const response = await api.get<SystemPresetsResponse>(
        '/screener/system-presets',
        { params },
      );
      return { success: true, data: response.data.data.items };
    } catch (error) {
      return toScreenerResult(error);
    }
  },

  getPresets: async (): Promise<ScreenerActionResult<ScreenerPreset[]>> => {
    try {
      const response = await api.get<PresetsResponse>('/screener/presets');
      return { success: true, data: response.data.data.items };
    } catch (error) {
      return toScreenerResult(error);
    }
  },

  createPreset: async (
    payload: CreateScreenerPresetPayload,
  ): Promise<ScreenerActionResult<ScreenerPreset>> => {
    try {
      const response = await api.post<PresetResponse>(
        '/screener/presets',
        payload,
      );
      return { success: true, data: response.data.data };
    } catch (error) {
      return toScreenerResult(error);
    }
  },

  deletePreset: async (id: number): Promise<ScreenerActionResult<boolean>> => {
    try {
      const response = await api.delete<DeletePresetResponse>(
        `/screener/presets/${id}`,
      );
      return { success: true, data: Boolean(response.data.data?.deleted) };
    } catch (error) {
      return toScreenerResult(error);
    }
  },
};
