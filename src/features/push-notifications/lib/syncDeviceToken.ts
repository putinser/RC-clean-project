import {Platform} from 'react-native';
import {serviceDeviceTokens} from '@services/device-tokens';
import {storage} from '@shared/lib/storage';
import {STORAGE_KEYS} from '@shared/lib/storageKeys';
import {getFcmToken} from './getFcmToken';

export async function registerDeviceToken(token?: string): Promise<void> {
  const fcmToken = token ?? (await getFcmToken());
  if (!fcmToken) {
    return;
  }

  await serviceDeviceTokens.register({
    token: fcmToken,
    platform: Platform.OS === 'ios' ? 'ios' : 'android',
  });
}

export async function unregisterDeviceToken(): Promise<void> {
  const fcmToken =
    (await storage.getItem<string>(STORAGE_KEYS.FCM_TOKEN)) ??
    (await getFcmToken());

  if (!fcmToken) {
    return;
  }

  await serviceDeviceTokens.unregister({token: fcmToken});
}
