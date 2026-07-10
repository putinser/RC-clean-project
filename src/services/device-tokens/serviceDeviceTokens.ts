import {api} from '@services/api';
import type {
  RegisterDeviceTokenPayload,
  UnregisterDeviceTokenPayload,
} from './types';

export const serviceDeviceTokens = {
  register: (payload: RegisterDeviceTokenPayload) =>
    api.post('/profile/device-tokens', payload),

  unregister: (payload: UnregisterDeviceTokenPayload) =>
    api.delete('/profile/device-tokens', {body: payload}),
};
