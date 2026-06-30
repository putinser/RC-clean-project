import { Text, View } from 'react-native';
import {
  type AssetTypeId,
  assetTypesNames,
} from '@widgets/chart/config/assetTypes';
import { formatAssetDisplayName } from '@widgets/chart/lib/formatAssetDisplayName';
import type { Asset } from '@services/assets/types';
import { formatAssetPrice } from '../lib/assetPrice';
import { AssetActions } from './AssetActions';
import { AssetPriceChange } from './AssetPriceChange';
import { AssetStatus } from './AssetStatus';

interface AssetCardProps {
  asset: Asset;
  isUnavailable: boolean;
}

export const AssetCard = ({ asset, isUnavailable }: AssetCardProps) => {
  return (
    <View className="gap-4 border-b border-white/5 px-4 py-4">
      <View className="flex-row items-start justify-between gap-3">
        <View className="min-w-0 shrink flex-1">
          <Text className="text-sm font-bold text-white" numberOfLines={1}>
            {formatAssetDisplayName(asset.name)}
          </Text>
          <Text className="mt-1 text-xs font-medium text-white/35">
            {assetTypesNames[asset.type as AssetTypeId] ?? asset.type}
          </Text>
        </View>
        <AssetActions asset={asset} isUnavailable={isUnavailable} />
      </View>

      <View className="flex-row gap-3">
        <View className="flex-1 rounded-xl border border-white/5 bg-white/5 p-3">
          <Text className="text-[10px] font-bold uppercase tracking-wider text-white/25">
            Цена
          </Text>
          <Text className="mt-1 text-sm font-semibold text-white font-numeric">
            {isUnavailable ? 'NN' : formatAssetPrice(asset.price?.value)}
          </Text>
        </View>
        <View className="flex-1 rounded-xl border border-white/5 bg-white/5 p-3">
          <Text className="text-[10px] font-bold uppercase tracking-wider text-white/25">
            Изменение
          </Text>
          <View className="mt-1">
            {isUnavailable ? (
              <Text className="text-sm font-semibold text-white/30">NN</Text>
            ) : (
              <AssetPriceChange asset={asset} />
            )}
          </View>
        </View>
      </View>

      <AssetStatus asset={asset} isUnavailable={isUnavailable} />
    </View>
  );
};
