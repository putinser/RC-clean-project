import notifee, {EventType} from '@notifee/react-native';
import {
  getInitialNotification,
  getMessaging,
  onMessage,
  onNotificationOpenedApp,
  onTokenRefresh,
} from '@react-native-firebase/messaging';
import {storage} from '@shared/lib/storage';
import {STORAGE_KEYS} from '@shared/lib/storageKeys';
import {displayForegroundNotification} from './displayForegroundNotification';
import {handleNotificationOpen} from './handleNotificationOpen';

type SubscribeToPushEventsOptions = {
  onTokenRefresh?: (token: string) => void;
};

export function subscribeToPushEvents(
  options?: SubscribeToPushEventsOptions,
): () => void {
  const messaging = getMessaging();

  const unsubscribeMessage = onMessage(messaging, async (remoteMessage) => {
    if (__DEV__) {
      console.log('[push] foreground', remoteMessage);
    }
    await displayForegroundNotification(remoteMessage);
  });

  const unsubscribeOpened = onNotificationOpenedApp(
    messaging,
    handleNotificationOpen,
  );

  getInitialNotification(messaging).then(handleNotificationOpen);

  const unsubscribeToken = onTokenRefresh(messaging, async (token) => {
    await storage.setItem(STORAGE_KEYS.FCM_TOKEN, token);
    if (__DEV__) {
      console.log('[push] token refresh:', token);
    }
    options?.onTokenRefresh?.(token);
  });

  const unsubscribeNotifee = notifee.onForegroundEvent(({type, detail}) => {
    if (type !== EventType.PRESS) {
      return;
    }

    const rawData = detail.notification?.data;
    const data = rawData
      ? Object.fromEntries(
          Object.entries(rawData).map(([key, value]) => [key, String(value)]),
        )
      : undefined;

    handleNotificationOpen({data});
  });

  return () => {
    unsubscribeMessage();
    unsubscribeOpened();
    unsubscribeToken();
    unsubscribeNotifee();
  };
}
