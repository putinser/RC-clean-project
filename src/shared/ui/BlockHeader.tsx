import {View, Text} from 'react-native';
import type {ReactNode} from 'react';
import {Rotate3d, type LucideIcon} from 'lucide-react-native';

export type BlockHeaderProps = {
  title: string;
  titleGradient?: string;
  eyeBrow: string;
  icon?: LucideIcon;
  children?: ReactNode;
};

export const BlockHeader = ({
  title,
  titleGradient,
  eyeBrow,
  icon: Icon = Rotate3d,
  children,
}: BlockHeaderProps) => {
  return (
    <View className="container-main">
      <View className="gap-1">
        <View className="flex-row items-center gap-2">
          <Icon color="#56d1fb" size={14} strokeWidth={2} />
          <Text className="text-[13px] font-bold text-primary">{eyeBrow}</Text>
        </View>
        <Text className="text-[25px] font-bold text-foreground">
          {title}
          {titleGradient ? ' ' : ''}
          {titleGradient ? (
            <Text className="text-foreground/80">{titleGradient}</Text>
          ) : null}
        </Text>
      </View>
      {children}
    </View>
  );
};
