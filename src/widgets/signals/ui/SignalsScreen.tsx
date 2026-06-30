import {
  useNavigation,
  useRoute,
  type RouteProp,
} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import type {
  MainTabNavigation,
  MainTabParamList,
} from '@shared/types/navigation';
import {SignalsController} from './SignalsController';

export const SignalsScreen = () => {
  const route = useRoute<RouteProp<MainTabParamList, 'Signals'>>();
  const navigation = useNavigation<MainTabNavigation>();
  const selectedAssetId = route.params?.selectedAssetId ?? null;

  const handleClearSelectedAsset = () => {
    navigation.setParams({selectedAssetId: undefined});
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <SignalsController
        selectedAssetId={selectedAssetId}
        onClearSelectedAsset={handleClearSelectedAsset}
      />
    </SafeAreaView>
  );
};
