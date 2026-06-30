import {
  useNavigation,
  useRoute,
  type RouteProp,
} from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type {
  MainTabNavigation,
  MainTabParamList,
} from '@shared/types/navigation';
import { ScreenerController } from './ScreenerController';

export const ScreenerScreen = () => {
  const route = useRoute<RouteProp<MainTabParamList, 'Screener'>>();
  const navigation = useNavigation<MainTabNavigation>();
  const selectedAssetId = route.params?.selectedAssetId ?? null;
  const selectedAssetName = route.params?.selectedAssetName ?? null;

  const handleClearSelectedAsset = () => {
    navigation.setParams({
      selectedAssetId: undefined,
      selectedAssetName: undefined,
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ScreenerController
        selectedAssetId={selectedAssetId}
        selectedAssetName={selectedAssetName}
        onClearSelectedAsset={handleClearSelectedAsset}
      />
    </SafeAreaView>
  );
};
