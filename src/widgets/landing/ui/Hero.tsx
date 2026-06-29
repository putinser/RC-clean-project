import {View, Text, ImageBackground} from 'react-native';
import {MainButton} from '@shared/ui/MainButton';
import {QuoteTicker} from '@entities/quote';
import {useNavigation} from '@react-navigation/native';
import type {LandingNavigation} from '@shared/types/navigation';

export const Hero = () => {
  const navigation = useNavigation<LandingNavigation>();

  return (
    <View className="relative w-full min-h-[500px] flex-col items-center justify-center pt-32 pb-4 mt-[25px]">
      <ImageBackground
        source={require('@assets/bgX1.webp')}
        resizeMode="cover"
        className="absolute inset-0"
      />
      <View className="container-main flex-col items-center justify-center gap-8 z-10">
        <View className="flex-col items-center justify-center gap-6">
          <Text className="text-[28px] font-bold leading-tight text-white text-center">
            {'Надёжная и безопасная платформа аналитики участников рынка Московской биржи.'}
          </Text>
          <Text className="text-sm text-text-secondary max-w-3xl font-medium text-center">
            Mosbir показывает динамику позиций, дисбаланс лонгов и шортов,
            открытый интерес и рыночное давление в одном рабочем интерфейсе.
          </Text>
        </View>
        <MainButton
          text="Получить доступ"
          onPress={() => navigation.navigate('Chart')}
        />
        <View className="mt-7 w-full">
          <QuoteTicker />
        </View>
      </View>
    </View>
  );
};
