import {View, Text} from 'react-native';
import LogoMark from '@assets/logo-mark.svg';
import {cn} from '@shared/lib/cn';

type LogoProps = {
  className?: string;
  size?: number;
};

export const Logo = ({className = 'w-[41px] h-[41px]', size = 24}: LogoProps) => {
  return (
    <View
      className={cn(
        'items-center justify-center rounded-[10px] border border-primary/30 bg-secondary/20',
        className,
      )}>
      <LogoMark width={size} height={size * 0.9} />
    </View>
  );
};

export const LogoWithText = ({
  className,
  size,
}: {
  className?: string;
  size?: number;
}) => (
  <View className="flex-row items-center gap-2">
    <Logo className={className} size={size} />
    <Text className="text-lg font-bold tracking-wider text-white">MOSBIR</Text>
  </View>
);
