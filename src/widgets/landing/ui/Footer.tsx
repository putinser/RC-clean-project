import {View, Text, Pressable} from 'react-native';
import {LogoWithText} from '@shared/ui/Logo';
import {Chip} from 'heroui-native/chip';
import {footerButtons} from '../config/content';
import {useHeaderNav} from '../model/useHeaderNav';

export const Footer = () => {
  const {handleNavPress} = useHeaderNav();

  return (
    <View className="container-main mt-10 py-6">
      <View className="gap-6">
        <View className="gap-6">
          <LogoWithText className="w-[35px] h-[35px]" size={18} />

          <View className="flex-row flex-wrap gap-x-4 gap-y-3">
            {footerButtons.map((button) => (
              <Pressable
                key={button.id}
                onPress={() => handleNavPress(button)}>
                <Text className="text-left text-sm font-bold text-[#AFB9C8]">
                  {button.label}
                </Text>
              </Pressable>
            ))}
          </View>

          <View className="flex-row flex-wrap items-center gap-3">
            <Chip
              variant="soft"
              color="success"
              className="border border-[#57EF70]/20 px-2 py-1">
              <Chip.Label>открыта</Chip.Label>
            </Chip>
            <Chip
              variant="soft"
              color="default"
              className="border border-[#181B22]/30 bg-[#181B22] px-2 py-1">
              <Chip.Label className="text-[#818D9F]">
                обновление 5 мин
              </Chip.Label>
            </Chip>
          </View>
        </View>

        <View className="h-px w-full bg-[#464B52]/40" />

        <View className="gap-2">
          <Text className="text-sm text-[#A6AAB2]">© 2026 Mosbir</Text>
          <Text className="text-sm text-[#A6AAB2]">support@mosbir.ru</Text>
        </View>
      </View>
    </View>
  );
};
