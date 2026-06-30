import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import type { Asset } from '@services/assets/types';
import { shownLimit } from '../config/constants';
import { cn } from '@shared/lib/cn';
import { SignalCard } from './SignalCard';

interface SignalsTableProps {
  assets: Asset[];
  title: string;
  isUnavailable?: boolean;
}

export const SignalsTable = ({
  assets,
  title,
  isUnavailable = false,
}: SignalsTableProps) => {
  const [page, setPage] = useState(1);
  const visibleAssets = assets.slice(0, shownLimit * page);
  const hasMore = assets.length > shownLimit;
  const isExpanded = visibleAssets.length >= assets.length;

  return (
    <View className="rounded-2xl border border-white/10 bg-[#0F1115] overflow-hidden">
      <View className="flex-row items-center justify-between gap-3 border-b border-white/5 px-4 py-3">
        <Text className="text-sm font-bold text-white/85">{title}</Text>
        <Text className="text-xs font-semibold text-white/35">
          {assets.length}
        </Text>
      </View>

      <View className={cn('flex-col', isUnavailable && 'opacity-70')}>
        {visibleAssets.map(asset => (
          <SignalCard
            key={asset.id}
            asset={asset}
            isUnavailable={isUnavailable}
          />
        ))}
      </View>

      {assets.length === 0 ? (
        <View className="px-6 py-10 items-center">
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
