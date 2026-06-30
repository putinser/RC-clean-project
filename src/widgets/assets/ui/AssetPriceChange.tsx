import { Text, View } from 'react-native';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react-native';
import { cn } from '@shared/lib/cn';
import type { Asset } from '@services/assets/types';
import { formatAssetChange, getAssetChangeDirection } from '../lib/assetPrice';

interface AssetPriceChangeProps {
  asset: Asset;
}

export const AssetPriceChange = ({ asset }: AssetPriceChangeProps) => {
  const direction = getAssetChangeDirection(asset);
  const value = formatAssetChange(asset.price?.daily_changes_value);
  const percent = formatAssetChange(asset.price?.daily_changes_perc, '%');

  if (!value && !percent) {
    return <Text className="text-sm font-semibold text-white/30">NN</Text>;
  }

  const Icon = direction === 'down' ? ArrowDownRight : ArrowUpRight;
  const colorClass =
    direction === 'up'
      ? 'text-[#4ADE80]'
      : direction === 'down'
        ? 'text-[#EF4444]'
        : 'text-white/45';

  return (
    <View className="flex-row items-center gap-1.5">
      {direction !== 'flat' ? (
        <Icon color={direction === 'up' ? '#4ADE80' : '#EF4444'} size={16} />
      ) : null}
      <Text className={cn('text-sm font-semibold font-numeric', colorClass)}>
        {[value, percent ? `(${percent})` : null].filter(Boolean).join(' ')}
      </Text>
    </View>
  );
};
