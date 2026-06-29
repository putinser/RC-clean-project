import {View, Text} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Logo} from '@shared/ui/Logo';
import {UserAvatar} from '@entities/user';

export const Header = () => {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="absolute top-0 left-0 right-0 z-50"
      style={{paddingTop: insets.top + 12}}>
      <View className="container-main">
        <View className="flex-row items-center justify-between gap-3">
          <View className="flex-row items-center gap-2 shrink min-w-0 flex-1">
            <Logo className="w-9 h-9" size={20} />
            <Text
              className="text-lg font-bold text-white shrink"
              numberOfLines={1}>
              MOSBIR
            </Text>
          </View>

          <UserAvatar />
        </View>
      </View>
    </View>
  );
};
