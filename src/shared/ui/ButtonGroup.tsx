import {View, Text, Pressable} from 'react-native';
import {cn} from '@shared/lib/cn';

type ButtonGroupItem = {
  id: string;
  label: string;
  onPress: () => void;
};

type ButtonGroupProps = {
  buttons: ButtonGroupItem[];
  className?: string;
};

export const ButtonGroup = ({buttons, className}: ButtonGroupProps) => {
  return (
    <View className={cn('flex-row max-w-[512px]', className)}>
      {buttons.map((button, index) => (
        <Pressable
          key={button.id}
          onPress={button.onPress}
          className={cn(
            'bg-secondary/20 h-[42px] px-5 items-center justify-center',
            'border-y border-primary/30',
            index === 0 && 'rounded-l-xl border-l',
            index === buttons.length - 1 && 'rounded-r-xl border-r',
          )}>
          <Text className="text-base font-bold text-[#AFB9C8]">
            {button.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};
