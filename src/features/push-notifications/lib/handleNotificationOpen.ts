import {navigationRef} from '@shared/lib/navigationRef';
import {getSignalTypeFromAsset} from './formatSignalPush';
import {parsePushData} from './parsePushData';

type NotificationOpenPayload = {
  data?: {[key: string]: string | object};
  notification?: {
    title?: string;
    body?: string;
  } | null;
};

function navigateWhenReady(action: () => void) {
  if (navigationRef.isReady()) {
    action();
    return;
  }

  const intervalId = setInterval(() => {
    if (navigationRef.isReady()) {
      clearInterval(intervalId);
      action();
    }
  }, 100);

  setTimeout(() => clearInterval(intervalId), 5000);
}

export function handleNotificationOpen(
  remoteMessage: NotificationOpenPayload | null,
) {
  if (!remoteMessage) {
    return;
  }

  const payload = parsePushData(remoteMessage.data);

  if (__DEV__) {
    console.log('[push] open', payload, remoteMessage.notification);
  }

  const entityId = payload.entityId ? Number(payload.entityId) : undefined;
  const assetId = Number.isFinite(entityId) ? entityId : undefined;
  const signalAsset = payload.assets?.[0];
  const selectedIsin = signalAsset?.isin;
  const selectedSignalType = getSignalTypeFromAsset(signalAsset);

  navigateWhenReady(() => {
    switch (payload.type) {
      case 'signal':
        navigationRef.navigate('Main', {
          screen: 'Signals',
          params:
            selectedIsin || assetId || selectedSignalType
              ? {
                  selectedAssetId: assetId,
                  selectedIsin,
                  selectedSignalType,
                }
              : undefined,
        });
        break;
      case 'asset':
        navigationRef.navigate('Main', {
          screen: 'Assets',
          params: assetId ? {selectedAssetId: assetId} : undefined,
        });
        break;
      case 'screener':
        navigationRef.navigate('Main', {
          screen: 'Screener',
          params: assetId ? {selectedAssetId: assetId} : undefined,
        });
        break;
      case 'chart':
        navigationRef.navigate('Main', {
          screen: 'Chart',
          params: assetId ? {assetId} : undefined,
        });
        break;
      default:
        break;
    }
  });
}
