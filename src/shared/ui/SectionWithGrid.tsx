import {View, ScrollView} from 'react-native';
import type {ReactNode} from 'react';
import {cn} from '@shared/lib/cn';
import {BlockHeader, type BlockHeaderProps} from './BlockHeader';

interface SectionWithGridProps {
  id?: string;
  headerProps: BlockHeaderProps;
  children: ReactNode;
  backgroundClassName?: string;
  className?: string;
  horizontal?: boolean;
}

export const SectionWithGrid = ({
  headerProps,
  children,
  backgroundClassName = 'bg-[#171A1F]',
  className,
  horizontal = false,
}: SectionWithGridProps) => {
  return (
    <View className={cn('flex-col gap-9 py-9', backgroundClassName, className)}>
      <BlockHeader {...headerProps} />
      {horizontal ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{paddingHorizontal: 16, gap: 16}}>
          {children}
        </ScrollView>
      ) : (
        <View className="container-main mt-2 gap-4">{children}</View>
      )}
    </View>
  );
};
