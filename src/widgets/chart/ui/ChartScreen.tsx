import {SafeAreaView} from 'react-native-safe-area-context';
import {ChartController} from './ChartController';

export const ChartScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ChartController />
    </SafeAreaView>
  );
};
