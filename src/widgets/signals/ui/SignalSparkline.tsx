import {View} from 'react-native';
import type {Asset} from '@services/assets/types';
import {SIGNAL_COLOR_NEUTRAL} from '../config/constants';
import {getAssetSignalColor} from '../lib/helpers';

interface SignalSparklineProps {
  asset?: Asset;
  width?: number;
  height?: number;
}

export const SignalSparkline = ({
  asset,
  width = 64,
  height = 28,
}: SignalSparklineProps) => {
  const color = asset ? getAssetSignalColor(asset) : SIGNAL_COLOR_NEUTRAL;

  return (
    <View style={{width, height, justifyContent: 'center'}}>
      <View
        style={{
          height: 2,
          width: '100%',
          backgroundColor: color,
          borderRadius: 1,
          transform: [{rotate: '-8deg'}],
        }}
      />
    </View>
  );
};
