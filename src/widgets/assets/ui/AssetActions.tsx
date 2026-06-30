import { Pressable, View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LineChart } from 'lucide-react-native';
import { FavoriteButton } from '@features/favorite-button';
import type { Asset } from '@services/assets/types';
import type { MainTabNavigation } from '@shared/types/navigation';

interface AssetActionsProps {
  asset: Asset;
  isUnavailable: boolean;
}

export const AssetActions = ({ asset, isUnavailable }: AssetActionsProps) => {
  const navigation = useNavigation<MainTabNavigation>();

  if (isUnavailable) {
    return (
      <Text className="text-xs font-semibold text-white/25">Недоступен</Text>
    );
  }

  const handleOpenChart = () => {
    navigation.navigate('Chart', { type: asset.type, assetId: asset.id });
  };

  return (
    <View className="flex-row items-center justify-end gap-2">
      <Pressable
        onPress={handleOpenChart}
        accessibilityRole="button"
        accessibilityLabel={`Открыть график ${asset.name}`}
        className="h-9 w-9 items-center justify-center rounded-lg"
      >
        <LineChart color="rgba(255,255,255,0.4)" size={16} />
      </Pressable>
      <FavoriteButton assetId={asset.id} assetName={asset.name} />
    </View>
  );
};
