import {View, Text, Pressable} from 'react-native';
import {X} from 'lucide-react-native';
import {useNavigation} from '@react-navigation/native';
import type {AppStackNavigation} from '@shared/types/navigation';
import {Logo} from '@shared/ui/Logo';

export const AuthBrandMark = () => {
  const navigation = useNavigation<AppStackNavigation>();

  return (
    <View className="flex-row items-center justify-between w-full">
      <View className="flex-row items-center gap-2">
        <Logo className="w-[35px] h-[35px]" size={18} />
        <Text className="text-base font-bold tracking-wider text-white">
          MOSBIR
        </Text>
      </View>
      <Pressable
        onPress={() => {
          if (navigation.canGoBack()) {
            navigation.goBack();
          } else {
            navigation.navigate('Home');
          }
        }}
        className="p-2"
        accessibilityLabel="Закрыть">
        <X color="#a6aab2" size={20} />
      </Pressable>
    </View>
  );
};
