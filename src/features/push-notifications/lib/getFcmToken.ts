import {getMessaging, getToken} from '@react-native-firebase/messaging';
import {storage} from '@shared/lib/storage';
import {STORAGE_KEYS} from '@shared/lib/storageKeys';

export async function getFcmToken(): Promise<string | null> {
  try {
    const token = await getToken(getMessaging());
    if (token) {
      await storage.setItem(STORAGE_KEYS.FCM_TOKEN, token);
    }
    return token;
  } catch (error) {
    if (__DEV__) {
      console.warn('[push] getToken failed:', error);
    }
    return null;
  }
}
