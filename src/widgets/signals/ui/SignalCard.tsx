import { Pressable, View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LineChart } from 'lucide-react-native';
import { FavoriteButton } from '@features/favorite-button';
import type { Asset } from '@services/assets/types';
import {
  type AssetTypeId,
  assetTypesNames,
} from '@widgets/chart/config/assetTypes';
import { formatAssetDisplayName } from '@widgets/chart/lib/formatAssetDisplayName';
import type { MainTabNavigation } from '@shared/types/navigation';
import { RsiValue } from './RsiValue';
import { SignalSparkline } from './SignalSparkline';

interface SignalCardProps {
  asset: Asset;
  isUnavailable?: boolean;
}

export const SignalCard = ({
  asset,
  isUnavailable = false,
}: SignalCardProps) => {
  const navigation = useNavigation<MainTabNavigation>();

  const handleOpenChart = () => {
    navigation.navigate('Chart', { type: asset.type, assetId: asset.id });
  };

  return (
    <View className="gap-4 border-b border-white/5 px-4 py-4">
      <View className="flex-row items-start justify-between gap-3">
        <View className="gap-1.5 shrink">
          <Text className="text-[10px] font-bold uppercase tracking-wider text-white/30">
            Тип актива
          </Text>
          <Text className="text-xs font-semibold text-white/60">
            {assetTypesNames[asset.type as AssetTypeId] ?? asset.type}
          </Text>
        </View>
        <View className="flex-row items-center gap-1.5">
          {!isUnavailable ? (
            <Pressable
              onPress={handleOpenChart}
              accessibilityRole="button"
              accessibilityLabel={`Открыть график ${asset.name}`}
              className="h-9 w-9 items-center justify-center rounded-lg"
            >
              <LineChart color="rgba(255,255,255,0.4)" size={18} />
            </Pressable>
          ) : null}
          <FavoriteButton assetId={asset.id} assetName={asset.name} />
        </View>
      </View>

      <View className="flex-row items-center justify-between gap-3">
        <View className="gap-1.5 shrink flex-1">
          <Text className="text-[10px] font-bold uppercase tracking-wider text-white/30">
            Актив
          </Text>
          <Text className="text-sm font-bold text-white/90" numberOfLines={1}>
            {formatAssetDisplayName(asset.name)}
          </Text>
        </View>
        <View className="shrink-0">
          <SignalSparkline asset={asset} />
        </View>
      </View>

      <View className="flex-row gap-6 pt-1">
        <View className="gap-2">
          <Text className="text-[10px] font-bold uppercase tracking-wider text-white/30">
            Юр. лица
          </Text>
          <RsiValue rsi={isUnavailable ? null : asset.rsi?.yur} />
        </View>
        <View className="gap-2">
          <Text className="text-[10px] font-bold uppercase tracking-wider text-white/30">
            Физ. лица
          </Text>
          <RsiValue rsi={isUnavailable ? null : asset.rsi?.fiz} />
        </View>
      </View>
    </View>
  );
};
