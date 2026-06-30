import { Pressable, Text, View } from 'react-native';
import { Spinner } from 'heroui-native/spinner';
import { cn } from '@shared/lib/cn';
import type { ScreenerListItem, ScreenerView } from '@services/screener/types';
import { ScreenerCard } from './ScreenerCard';

interface ScreenerTableProps {
  items: ScreenerListItem[];
  total: number;
  view: ScreenerView;
  hasMore: boolean;
  isLoadingMore: boolean;
  onLoadMore: () => void;
}

export const ScreenerTable = ({
  items,
  total,
  view,
  hasMore,
  isLoadingMore,
  onLoadMore,
}: ScreenerTableProps) => {
  return (
    <View className="overflow-hidden rounded-2xl border border-white/10 bg-[#0F1115]">
      <View className="border-b border-white/5 px-4 py-3">
        <Text className="text-sm font-bold text-white/85">
          Результаты скринера
        </Text>
        <Text className="mt-1 text-xs text-white/35">
          Показано {items.length} из {total}
        </Text>
      </View>

      {items.map(item => (
        <ScreenerCard key={item.asset.id} item={item} view={view} />
      ))}

      {items.length === 0 ? (
        <View className="items-center px-6 py-10">
          <Text className="text-sm font-medium text-white/35">
            Активы не найдены
          </Text>
        </View>
      ) : null}

      {hasMore ? (
        <Pressable
          onPress={onLoadMore}
          disabled={isLoadingMore}
          className="flex-row items-center justify-center gap-2 border-t border-white/5 px-4 py-3"
        >
          {isLoadingMore ? <Spinner size="sm" /> : null}
          <Text
            className={cn(
              'text-sm font-semibold',
              isLoadingMore ? 'text-white/35' : 'text-primary',
            )}
          >
            Показать ещё
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
};
