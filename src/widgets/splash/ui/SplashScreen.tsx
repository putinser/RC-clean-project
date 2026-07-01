import {Image, View} from 'react-native';

const appIcon = require('@assets/app-icon.png');

export function SplashScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-[#060B12]">
      <Image source={appIcon} style={{width: 80, height: 80}} resizeMode="contain" />
    </View>
  );
}
