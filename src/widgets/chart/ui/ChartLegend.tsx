import {Text, View} from 'react-native';
import {
  type ChartMetricId,
  getLegalSeriesLabel,
} from '../config/chartMetric';
import type {ChartViewId} from '../config/chartView';
import {CHART_SIGNAL_COLORS} from '../lib/chartSignalColors';
import type {ChartLegalSeriesItem} from '../lib/chartView.types';

type ChartLegendProps = {
  view: ChartViewId;
  legalSeries: ChartLegalSeriesItem[];
  priceColor: string;
  latestPrice: number | undefined;
  latestSignalValue: number | undefined;
  signalThresholds?: {
    overbought: number;
    oversold: number;
  };
  metric: ChartMetricId;
  isFiz: boolean;
  variant?: 'default' | 'compact';
};

function SignalLegendItem({
  color,
  label,
  value,
}: {
  color: string;
  label: string;
  value?: string;
}) {
  return (
    <View className="flex-row items-center gap-2">
      <View className="h-0.5 w-4" style={{backgroundColor: color}} />
      <Text className="text-xs text-[#8b949e]">
        {label}
        {value ? (
          <Text className="font-semibold text-white">: {value}</Text>
        ) : null}
      </Text>
    </View>
  );
}

export const ChartLegend = ({
  view,
  legalSeries,
  priceColor,
  latestPrice,
  latestSignalValue,
  signalThresholds,
  metric,
  isFiz,
  variant = 'default',
}: ChartLegendProps) => {
  const isCompact = variant === 'compact';
  const containerClassName = isCompact
    ? 'flex-row flex-wrap items-center gap-x-4 gap-y-1 px-2 py-1'
    : 'rounded-2xl border border-[#21262d] bg-[#0F1115] p-3 gap-3';
  const itemsClassName = isCompact
    ? 'flex-row flex-wrap items-center gap-x-4 gap-y-1'
    : 'flex-row flex-wrap gap-x-4 gap-y-2';
  const footerClassName = isCompact
    ? 'text-[10px] text-[#6e7681] ml-auto'
    : 'text-xs text-[#6e7681]';

  if (view === 'signals') {
    return (
      <View className={containerClassName}>
        <View className={itemsClassName}>
          <SignalLegendItem
            color={CHART_SIGNAL_COLORS.neutral}
            label={`Сигнал (${isFiz ? 'Физ. лица' : 'Юр. лица'})`}
            value={
              latestSignalValue !== undefined
                ? latestSignalValue.toLocaleString('ru-RU')
                : '—'
            }
          />
          <SignalLegendItem
            color={CHART_SIGNAL_COLORS.success}
            label="Оптимизм"
          />
          <SignalLegendItem
            color={CHART_SIGNAL_COLORS.fail}
            label="Пессимизм"
          />
          <SignalLegendItem
            color={CHART_SIGNAL_COLORS.neutral}
            label="Нейтрально"
          />
          {signalThresholds ? (
            <Text className="text-xs text-[#6e7681]">
              Пороги: {signalThresholds.oversold} / {signalThresholds.overbought}
            </Text>
          ) : null}
        </View>
        {!isCompact ? (
          <Text className={footerClassName}>Обновление: каждые 5 мин</Text>
        ) : null}
      </View>
    );
  }

  if (view === 'asset-price') {
    return (
      <View className={containerClassName}>
        <View className={itemsClassName}>
          <SignalLegendItem
            color={priceColor}
            label="Фьючерс"
            value={
              latestPrice !== undefined
                ? latestPrice.toLocaleString('ru-RU')
                : '—'
            }
          />
          <SignalLegendItem
            color={CHART_SIGNAL_COLORS.success}
            label="Оптимизм"
          />
          <SignalLegendItem
            color={CHART_SIGNAL_COLORS.fail}
            label="Пессимизм"
          />
          <SignalLegendItem
            color={CHART_SIGNAL_COLORS.neutral}
            label="Нейтрально"
          />
        </View>
        {!isCompact ? (
          <Text className={footerClassName}>Обновление: каждые 5 мин</Text>
        ) : null}
      </View>
    );
  }

  return (
    <View className={containerClassName}>
      <View className={itemsClassName}>
        {legalSeries.map((item) => (
          <View key={item.id} className="flex-row items-center gap-2">
            <View className="h-0.5 w-4" style={{backgroundColor: item.color}} />
            <Text className="text-xs text-[#8b949e]">
              {getLegalSeriesLabel(item.name, isFiz, metric)}:{' '}
              <Text className="font-semibold text-white">
                {item.latestValue !== undefined
                  ? item.latestValue.toLocaleString('ru-RU')
                  : '—'}
              </Text>
            </Text>
          </View>
        ))}
        <View className="flex-row items-center gap-2">
          <View className="h-0.5 w-4" style={{backgroundColor: priceColor}} />
          <Text className="text-xs text-[#8b949e]">
            Фьючерс:{' '}
            <Text className="font-semibold text-white">
              {latestPrice !== undefined
                ? latestPrice.toLocaleString('ru-RU')
                : '—'}
            </Text>
          </Text>
        </View>
      </View>
      {!isCompact ? (
        <Text className={footerClassName}>Обновление: каждые 5 мин</Text>
      ) : null}
    </View>
  );
};
