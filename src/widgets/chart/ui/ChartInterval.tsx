import {Pressable, Text, View} from 'react-native';
import {cn} from '@shared/lib/cn';
import type {ChartIntervalId} from '../config/chartInterval';

type ChartIntervalProps = {
  interval: ChartIntervalId;
  handleInterval: (interval: ChartIntervalId) => void;
  options?: readonly {id: ChartIntervalId; label: string}[];
};

export const ChartInterval = ({
  interval,
  handleInterval,
  options,
}: ChartIntervalProps) => {
  return (
    <View className="flex-row items-center gap-2">
      <Text className="text-sm text-[#999999]">Интервал:</Text>
      <View className="flex-row items-center gap-2">
        {(options ?? []).map(({id, label}) => {
          const isActive = interval === id;
          return (
            <Pressable
              key={id}
              onPress={() => handleInterval(id)}
              className={cn(
                'rounded-lg px-2.5 py-1',
                isActive ? 'bg-[#4754E1]' : 'active:bg-[#ffffff16]',
              )}>
              <Text
                className={cn(
                  'text-sm font-normal',
                  isActive ? 'text-white' : 'text-white/70',
                )}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};
