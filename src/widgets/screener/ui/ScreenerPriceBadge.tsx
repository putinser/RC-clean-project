import { Text, View } from 'react-native';
import { cn } from '@shared/lib/cn';
import { formatPercent, formatPrice } from '../lib/helpers';

interface ScreenerPriceBadgeProps {
  price: number | null;
  changePercent: number | null;
}

export const ScreenerPriceBadge = ({
  price,
  changePercent,
}: ScreenerPriceBadgeProps) => {
  const value = changePercent ?? 0;
  const isUp = value > 0;
  const isDown = value < 0;

  return (
    <View
      className={cn(
        'self-start rounded-lg border px-2.5 py-1.5',
        isUp && 'border-[#4ADE80]/20 bg-[#4ADE80]/10',
        isDown && 'border-[#EF4444]/20 bg-[#EF4444]/10',
        !isUp && !isDown && 'border-white/10 bg-white/5',
      )}
    >
      <Text
        className={cn(
          'text-xs font-bold font-numeric',
          isUp && 'text-[#4ADE80]',
          isDown && 'text-[#EF4444]',
          !isUp && !isDown && 'text-white/45',
        )}
      >
        {formatPrice(price)} ₽
        {changePercent !== null && changePercent !== undefined
          ? ` (${formatPercent(changePercent, 'exceptZero')})`
          : ''}
      </Text>
    </View>
  );
};
