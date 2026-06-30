import {Text, View} from 'react-native';
import {Path, Svg} from 'react-native-svg';
import {cn} from '@shared/lib/cn';
import type {
  ScreenerChangeSign,
  ScreenerRatioBlock,
} from '@services/screener/types';
import {formatPercent} from '../lib/helpers';

interface ScreenerRatioBarProps {
  ratio: ScreenerRatioBlock;
  longLabel: string;
  shortLabel: string;
  variant?: 'positions' | 'participants';
  changeSign?: ScreenerChangeSign;
  className?: string;
}

const variantColors = {
  positions: {long: '#16A34A', short: '#DC2626'},
  participants: {long: '#2563EB', short: '#C026D3'},
} as const;

const markerColors = {
  green: '#4ADE80',
  red: '#EF4444',
  white: '#FFFFFF',
  pink: '#F472B6',
} as const;

function getRatioMarker(
  ratio: ScreenerRatioBlock,
  variant: 'positions' | 'participants',
  changeSign?: ScreenerChangeSign,
) {
  const {direction, long_percent, short_percent} = ratio;

  if (
    long_percent === null ||
    short_percent === null ||
    !direction ||
    direction === 'neutral'
  ) {
    return null;
  }

  if (variant === 'participants') {
    if (direction === 'towards_long') {
      return {pointsLeft: false, color: markerColors.green};
    }

    return {pointsLeft: true, color: markerColors.pink};
  }

  const isSkewed = long_percent >= 85 || short_percent >= 85;

  if (changeSign === 1) {
    return {
      pointsLeft: false,
      color: isSkewed ? markerColors.white : markerColors.green,
    };
  }

  if (changeSign === -1) {
    return {
      pointsLeft: true,
      color: isSkewed ? markerColors.white : markerColors.red,
    };
  }

  if (changeSign === 0) {
    return {
      pointsLeft: direction === 'towards_short',
      color: markerColors.white,
    };
  }

  return null;
}

function RatioDirectionMarker({
  marker,
  splitPercent,
}: {
  marker: {pointsLeft: boolean; color: string};
  splitPercent: number;
}) {
  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        top: '50%',
        left: `${splitPercent}%`,
        marginTop: -6,
        marginLeft: marker.pointsLeft ? -8 : 0,
        zIndex: 30,
      }}>
      <Svg width={8} height={12} viewBox="0 0 8 12">
        <Path
          d={
            marker.pointsLeft
              ? 'M8 0 L0 6 L8 12 Z'
              : 'M0 0 L8 6 L0 12 Z'
          }
          fill={marker.color}
        />
      </Svg>
    </View>
  );
}

export const ScreenerRatioBar = ({
  ratio,
  longLabel,
  shortLabel,
  variant = 'positions',
  changeSign,
  className,
}: ScreenerRatioBarProps) => {
  const longPercent = ratio.long_percent ?? 0;
  const shortPercent = ratio.short_percent ?? 0;
  const isEmpty = ratio.long_percent === null || ratio.short_percent === null;
  const colors = variantColors[variant];
  const marker = getRatioMarker(ratio, variant, changeSign);

  if (isEmpty) {
    return (
      <View className={cn('min-w-0', className)}>
        <View className="h-8 items-center justify-center rounded-xl border border-white/10 bg-white/5">
          <Text className="text-xs font-semibold text-white/30">NN</Text>
        </View>
      </View>
    );
  }

  return (
    <View className={cn('min-w-0', className)}>
      <View className="mb-1 flex-row items-center justify-between">
        <Text className="text-[10px] font-semibold text-white/40">
          {longLabel}
        </Text>
        <Text className="text-[10px] font-semibold text-white/40">
          {shortLabel}
        </Text>
      </View>
      <View className="relative h-8 rounded-xl border border-white/10 bg-[#27282E]">
        <View className="absolute inset-0 overflow-hidden rounded-[11px]">
          <View className="h-full flex-row">
            <View
              style={{width: `${longPercent}%`, backgroundColor: colors.long}}
            />
            <View
              style={{
                width: `${shortPercent}%`,
                backgroundColor: colors.short,
              }}
            />
          </View>
        </View>
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: '50%',
            top: 4,
            bottom: 4,
            width: 1,
            marginLeft: -0.5,
            backgroundColor: 'rgba(255,255,255,0.2)',
            zIndex: 10,
          }}
        />
        {marker ? (
          <RatioDirectionMarker marker={marker} splitPercent={longPercent} />
        ) : null}
        <View
          pointerEvents="none"
          className="absolute inset-0 z-20 flex-row items-center justify-between px-2">
          <Text className="text-[11px] font-bold text-white">
            {formatPercent(ratio.long_percent)}
          </Text>
          <Text className="text-[11px] font-bold text-white">
            {formatPercent(ratio.short_percent)}
          </Text>
        </View>
      </View>
    </View>
  );
};
