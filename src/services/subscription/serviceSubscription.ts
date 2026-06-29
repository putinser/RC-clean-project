import {api} from '@services/api';
import type {SubscriptionTariffsResponse, Tariff} from './types';

export const serviceSubscription = {
  getSubscription: async (): Promise<Tariff[]> => {
    const response = await api.get<SubscriptionTariffsResponse>(
      '/subscription/tariffs',
    );
    return response.data.data;
  },
};
