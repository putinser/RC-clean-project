import type {ReactNode} from 'react';
import {Text, View} from 'react-native';
import {cn} from '@shared/lib/cn';
import type {ChartAssetStats} from '../lib/chartView.types';

type ChartPriceOverlayProps = {
  stats: ChartAssetStats;
  dense?: boolean;
  action?: ReactNode;
};

export const ChartPriceOverlay = ({
  stats,
  dense = false,
  action,
}: ChartPriceOverlayProps) => {
  const {latestPrice, changeValue, changePerc} = stats;

  const isUp = (changeValue ?? 0) > 0 || (changePerc ?? 0) > 0;
  const isDown = (changeValue ?? 0) < 0 || (changePerc ?? 0) < 0;
  const hasChange = changeValue !== undefined || changePerc !== undefined;

  const changeLabel = [
    changeValue !== undefined
      ? `${changeValue >= 0 ? '+' : ''}${changeValue.toLocaleString('ru-RU')}`
      : null,
    changePerc !== undefined
      ? `(${changePerc >= 0 ? '+' : ''}${changePerc.toLocaleString('ru-RU')}%)`
      : null,
  ]
    .filter(Boolean)
    .join(' ');

  if (latestPrice === undefined && !action) {
    return null;
  }

  return (
    <View
      className={cn(
        'flex-row items-start gap-2',
        action ? 'justify-between' : 'justify-start',
      )}
      pointerEvents="box-none">
      {latestPrice !== undefined ? (
        <View
          className={cn(
            'min-w-0 flex-row flex-wrap items-center rounded-lg bg-[#0F1115]/95',
            dense ? 'gap-1 px-1.5 py-1' : 'gap-1.5 rounded-xl px-2 py-1.5',
          )}
          style={action ? {maxWidth: '78%'} : undefined}>
          <View
            className={cn(
              'items-center justify-center rounded-full',
              dense ? 'h-4 w-4' : 'h-5 w-5',
              isUp && 'bg-[#4ADE80]',
              isDown && 'bg-[#EF4444]',
              !isUp && !isDown && 'bg-white/20',
            )}>
            <View
              style={
                isDown
                  ? {
                      width: 0,
                      height: 0,
                      borderLeftWidth: dense ? 3 : 4,
                      borderRightWidth: dense ? 3 : 4,
                      borderTopWidth: dense ? 5 : 6,
                      borderLeftColor: 'transparent',
                      borderRightColor: 'transparent',
                      borderTopColor: '#0F1115',
                      marginTop: 2,
                    }
                  : {
                      width: 0,
                      height: 0,
                      borderLeftWidth: dense ? 3 : 4,
                      borderRightWidth: dense ? 3 : 4,
                      borderBottomWidth: dense ? 5 : 6,
                      borderLeftColor: 'transparent',
                      borderRightColor: 'transparent',
                      borderBottomColor: '#0F1115',
                      marginBottom: 2,
                    }
              }
            />
          </View>
          <Text
            className={cn(
              'font-semibold text-white',
              dense ? 'text-xs' : 'text-sm',
            )}>
            {latestPrice.toLocaleString('ru-RU')}
          </Text>
          {hasChange && changeLabel ? (
            <View
              className={cn(
                'max-w-full items-center rounded-full px-1.5 py-0.5',
                dense ? undefined : 'px-2',
                isUp && 'bg-[#4ADE80]',
                isDown && 'bg-[#EF4444]',
                !isUp && !isDown && 'bg-white/10',
              )}>
              <Text
                className={cn(
                  'font-semibold',
                  dense ? 'text-[10px]' : 'text-xs',
                  isUp && 'text-[#0F1115]',
                  isDown && 'text-white',
                  !isUp && !isDown && 'text-white/60',
                )}
                numberOfLines={1}>
                {changeLabel}
              </Text>
            </View>
          ) : null}
        </View>
      ) : (
        <View />
      )}
      {action ? <View className="shrink-0">{action}</View> : null}
    </View>
  );
};
