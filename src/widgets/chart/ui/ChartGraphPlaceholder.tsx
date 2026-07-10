import {View} from 'react-native';
import {Spinner} from 'heroui-native/spinner';

type ChartGraphPlaceholderProps = {
  width: number;
  height: number;
};

export const ChartGraphPlaceholder = ({
  width,
  height,
}: ChartGraphPlaceholderProps) => {
  return (
    <View className="gap-2.5">
      <View className="overflow-hidden rounded-2xl border border-[#21262d] bg-[#0d1117] -px-1 py-3">
        <View
          style={{width, height}}
          className="relative items-center justify-center bg-[#0d1117]">
          <Spinner />
        </View>
      </View>
      <View className="h-5" />
    </View>
  );
};
