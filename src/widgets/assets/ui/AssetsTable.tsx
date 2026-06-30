import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { cn } from '@shared/lib/cn';
import type { Asset } from '@services/assets/types';
import { shownLimit } from '../config/constants';
import { AssetCard } from './AssetCard';

interface AssetsTableProps {
  assets: Asset[];
  title: string;
  description?: string;
  isUnavailable?: boolean;
}

export const AssetsTable = ({
  assets,
  title,
  description,
  isUnavailable = false,
}: AssetsTableProps) => {
  const [page, setPage] = useState(1);
  const visibleAssets = assets.slice(0, shownLimit * page);
  const hasMore = assets.length > shownLimit;
  const isExpanded = visibleAssets.length >= assets.length;

  return (
    <View className="overflow-hidden rounded-2xl border border-white/10 bg-[#0F1115]">
      <View className="gap-1 border-b border-white/5 px-4 py-4">
        <View className="flex-row items-center justify-between gap-3">
          <Text className="text-sm font-bold text-white/85">{title}</Text>
          <View className="rounded-full bg-white/5 px-2.5 py-1">
            <Text className="text-xs font-semibold text-white/40">
              {assets.length}
            </Text>
          </View>
        </View>
        {description ? (
          <Text className="text-xs leading-relaxed text-white/35">
            {description}
          </Text>
        ) : null}
      </View>

      <View className={cn('flex-col', isUnavailable && 'opacity-70')}>
        {visibleAssets.map(asset => (
          <AssetCard
            key={asset.id}
            asset={asset}
            isUnavailable={isUnavailable}
          />
        ))}
      </View>

      {assets.length === 0 ? (
        <View className="items-center px-6 py-10">
          <Text className="text-sm font-medium text-white/35">
            Активы не найдены
          </Text>
        </View>
      ) : null}

      {hasMore ? (
        <Pressable
          onPress={() => setPage(isExpanded ? 1 : page + 1)}
          className="w-full border-t border-white/5 px-4 py-3"
        >
          <Text className="text-center text-sm font-semibold text-primary">
            {isExpanded ? 'Скрыть' : 'Показать ещё'}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
};
