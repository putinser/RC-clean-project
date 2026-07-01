import {Text, View} from 'react-native';
import type {ChartAssetStats} from '../lib/chartView.types';

type ChartStatsOverlayProps = {
  stats: ChartAssetStats;
};

export const ChartStatsOverlay = ({stats}: ChartStatsOverlayProps) => {
  if (stats.latestPrice == null) {
    return null;
  }

  return (
    <View className="rounded-lg bg-[#0F1115]/95 px-2 py-1.5">
      <View className="flex-row flex-wrap gap-x-3 gap-y-1">
        <View className="flex-row items-center gap-1">
          <Text className="text-[11px] text-[#8b949e]">Цена</Text>
          <Text className="text-xs font-semibold text-white">
            {stats.latestPrice.toLocaleString('ru-RU', {
              maximumFractionDigits: 2,
            })}
          </Text>
        </View>

        {stats.changeValue !== undefined ? (
          <View className="flex-row items-center gap-1">
            <Text className="text-[11px] text-[#8b949e]">Изм.</Text>
            <Text
              style={{color: stats.changeColor}}
              className="text-xs font-semibold">
              {stats.changeValue > 0 ? '+' : ''}
              {stats.changeValue.toLocaleString('ru-RU', {
                maximumFractionDigits: 2,
              })}
            </Text>
          </View>
        ) : null}

        {stats.changePerc !== undefined ? (
          <View className="flex-row items-center gap-1">
            <Text className="text-[11px] text-[#8b949e]">Изм.%</Text>
            <Text
              style={{color: stats.changeColor}}
              className="text-xs font-semibold">
              {stats.changePerc > 0 ? '+' : ''}
              {stats.changePerc.toFixed(2)}%
            </Text>
          </View>
        ) : null}

        {stats.volume !== undefined ? (
          <View className="flex-row items-center gap-1">
            <Text className="text-[11px] text-[#8b949e]">Объём</Text>
            <Text className="text-xs font-semibold text-white">
              {stats.volume}
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  );
};
