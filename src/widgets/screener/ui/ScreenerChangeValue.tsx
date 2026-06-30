import { Text } from 'react-native';
import { cn } from '@shared/lib/cn';
import type { ScreenerChangeBlock } from '@services/screener/types';
import { formatPercent, getChangeTone } from '../lib/helpers';

interface ScreenerChangeValueProps {
  change: ScreenerChangeBlock;
  className?: string;
}

export const ScreenerChangeValue = ({
  change,
  className,
}: ScreenerChangeValueProps) => {
  if (change.insufficient || change.value === null) {
    return (
      <Text className={cn('text-sm font-semibold text-white/25', className)}>
        —
      </Text>
    );
  }

  return (
    <Text
      className={cn(
        'text-sm font-bold font-numeric',
        getChangeTone(change.sign),
        className,
      )}
    >
      {formatPercent(change.value, 'exceptZero')}
    </Text>
  );
};
