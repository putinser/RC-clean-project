import notifee, {AndroidImportance} from '@notifee/react-native';
import type {FirebaseMessagingTypes} from '@react-native-firebase/messaging';
import {formatSignalPushBody} from './formatSignalPush';
import {parsePushData} from './parsePushData';

const CHANNEL_ID = 'default';

export async function displayForegroundNotification(
  remoteMessage: FirebaseMessagingTypes.RemoteMessage,
) {
  const channelId = await notifee.createChannel({
    id: CHANNEL_ID,
    name: 'Уведомления',
    importance: AndroidImportance.HIGH,
  });

  const payload = parsePushData(remoteMessage.data);
  const signalBody =
    payload.type === 'signal' ? formatSignalPushBody(payload.assets) : null;

  const title =
    remoteMessage.notification?.title ??
    (payload.type === 'signal' ? 'Уведомления по сигналам' : 'Уведомление');
  const body = signalBody ?? remoteMessage.notification?.body;

  if (!title && !body) {
    return;
  }

  await notifee.displayNotification({
    title,
    body,
    data: remoteMessage.data,
    android: {
      channelId,
      pressAction: {
        id: 'default',
      },
    },
  });
}
