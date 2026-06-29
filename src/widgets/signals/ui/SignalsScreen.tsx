import {View, Text} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

export const SignalsScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-foreground text-lg font-bold">Сигналы</Text>
        <Text className="text-text-secondary text-sm mt-2">
          Раздел в разработке (Фаза 5)
        </Text>
      </View>
    </SafeAreaView>
  );
};
