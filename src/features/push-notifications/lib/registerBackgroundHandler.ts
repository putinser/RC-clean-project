import {
  getMessaging,
  setBackgroundMessageHandler,
} from '@react-native-firebase/messaging';

export function registerBackgroundHandler() {
  setBackgroundMessageHandler(getMessaging(), async remoteMessage => {
    if (__DEV__) {
      console.log('[push] background', remoteMessage);
    }
  });
}
