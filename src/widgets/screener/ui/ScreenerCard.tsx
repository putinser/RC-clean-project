import { Pressable, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LineChart } from 'lucide-react-native';
import { FavoriteButton } from '@features/favorite-button';
import {
  type AssetTypeId,
  assetTypesNames,
} from '@widgets/chart/config/assetTypes';
import { formatAssetDisplayName } from '@widgets/chart/lib/formatAssetDisplayName';
import type { ScreenerListItem, ScreenerView } from '@services/screener/types';
import type { MainTabNavigation } from '@shared/types/navigation';
import { formatAssetCode } from '../lib/helpers';
import { ScreenerChangeValue } from './ScreenerChangeValue';
import { ScreenerPriceBadge } from './ScreenerPriceBadge';
import { ScreenerRatioBar } from './ScreenerRatioBar';

interface ScreenerCardProps {
  item: ScreenerListItem;
  view: ScreenerView;
}

export const ScreenerCard = ({ item, view }: ScreenerCardProps) => {
  const navigation = useNavigation<MainTabNavigation>();

  const handleOpenChart = () => {
    navigation.navigate('Chart', {
      type: item.asset.type,
      assetId: item.asset.id,
    });
  };

  return (
    <View className="gap-4 border-b border-white/5 px-4 py-4">
      <View className="flex-row items-start justify-between gap-3">
        <View className="min-w-0 shrink flex-1">
          <Text className="text-[11px] font-semibold uppercase tracking-wider text-white/35">
            {assetTypesNames[item.asset.type as AssetTypeId] ?? item.asset.type}
          </Text>
          <Text className="mt-1 text-sm font-bold text-white" numberOfLines={1}>
            {formatAssetDisplayName(item.asset.name)}
          </Text>
          <Text className="mt-1 text-xs font-medium text-white/35">
            {formatAssetCode(item.asset)}
          </Text>
        </View>
        <View className="flex-row items-center gap-1.5">
          <Pressable
            onPress={handleOpenChart}
            accessibilityRole="button"
            accessibilityLabel={`Открыть график ${item.asset.name}`}
            className="h-8 w-8 items-center justify-center rounded-lg"
          >
            <LineChart color="rgba(255,255,255,0.4)" size={16} />
          </Pressable>
          <FavoriteButton assetId={item.asset.id} assetName={item.asset.name} />
        </View>
      </View>

      {view === 'ratios' ? (
        <View className="gap-3">
          <ScreenerRatioBar
            ratio={item.snapshot.positions.ratio}
            longLabel="Покупки"
            shortLabel="Продажи"
            variant="positions"
            changeSign={item.snapshot.net.position_change.sign}
          />
          <ScreenerRatioBar
            ratio={item.snapshot.participants.ratio}
            longLabel="Покупатели"
            shortLabel="Продавцы"
            variant="participants"
          />
        </View>
      ) : (
        <View className="gap-4">
          <View>
            <Text className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-white/35">
              Покупки/Продажи
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {[
                {
                  label: 'Покупки',
                  change: item.snapshot.positions.change_long,
                },
                {
                  label: 'Продажи',
                  change: item.snapshot.positions.change_short,
                },
                {
                  label: 'Чистая поз.',
                  change: item.snapshot.net.position_change,
                },
                {
                  label: 'Откр. инт.',
                  change: item.snapshot.open_interest.positions_change,
                },
              ].map(cell => (
                <View
                  key={cell.label}
                  className="min-w-[46%] flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2"
                >
                  <Text className="text-[10px] font-semibold text-white/30">
                    {cell.label}
                  </Text>
                  <View className="mt-1">
                    <ScreenerChangeValue change={cell.change} />
                  </View>
                </View>
              ))}
            </View>
          </View>
          <View>
            <Text className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-white/35">
              Покупатели/Продавцы
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {[
                {
                  label: 'Покупатели',
                  change: item.snapshot.participants.change_long,
                },
                {
                  label: 'Продавцы',
                  change: item.snapshot.participants.change_short,
                },
                {
                  label: 'Чистая поз.',
                  change: item.snapshot.net.participants_change,
                },
                {
                  label: 'Откр. инт.',
                  change: item.snapshot.open_interest.participants_change,
                },
              ].map(cell => (
                <View
                  key={cell.label}
                  className="min-w-[46%] flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2"
                >
                  <Text className="text-[10px] font-semibold text-white/30">
                    {cell.label}
                  </Text>
                  <View className="mt-1">
                    <ScreenerChangeValue change={cell.change} />
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
      )}

      <ScreenerPriceBadge
        price={item.asset.last_price}
        changePercent={item.asset.last_price_change_percent}
      />
    </View>
  );
};
