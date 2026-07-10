import {useEffect} from 'react';
import {useUserStore} from '@entities/user';
import {getFcmToken} from '../lib/getFcmToken';
import {requestPushPermission} from '../lib/requestPushPermission';
import {registerDeviceToken} from '../lib/syncDeviceToken';
import {subscribeToPushEvents} from '../lib/subscribeToPushEvents';

export function PushNotificationsInit() {
  const isAuthorized = useUserStore((state) => state.isAuthorized);

  useEffect(() => {
    let unsubscribe = () => {};
    let cancelled = false;

    const init = async () => {
      const granted = await requestPushPermission();
      if (!granted || cancelled) {
        return;
      }

      const token = await getFcmToken();
      if (__DEV__) {
        console.warn('[push] FCM token:', token ?? 'null');
      }

      if (!cancelled) {
        unsubscribe = subscribeToPushEvents({
          onTokenRefresh: (nextToken) => {
            if (useUserStore.getState().isAuthorized) {
              registerDeviceToken(nextToken).catch(() => undefined);
            }
          },
        });
      }
    };

    init().catch((error) => {
      if (__DEV__) {
        console.warn('[push] init failed:', error);
      }
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!isAuthorized) {
      return;
    }

    registerDeviceToken().catch((error) => {
      if (__DEV__) {
        console.warn('[push] register failed:', error);
      }
    });
  }, [isAuthorized]);

  return null;
}
