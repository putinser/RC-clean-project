import { Text, View } from 'react-native';
import type { AssetRsiValue } from '@services/assets/types';
import { getRsiColor } from '../lib/helpers';

interface RsiValueProps {
  rsi?: AssetRsiValue | null;
}

export const RsiValue = ({ rsi }: RsiValueProps) => {
  const color = getRsiColor(rsi);

  return (
    <View className="flex-row items-center gap-2">
      <View
        className="h-2.5 w-6 rounded-full"
        style={{ backgroundColor: color }}
      />
      <Text className="w-9 text-sm font-semibold text-white/80 font-numeric">
        {rsi?.value ?? 'NN'}
      </Text>
    </View>
  );
};
