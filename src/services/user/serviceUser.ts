import {api} from '@services/api';
import type {MeResponse} from './types';

export const serviceUser = {
  me: async (): Promise<MeResponse> => {
    const response = await api.get<MeResponse>('/auth/me');
    return response.data;
  },
};
