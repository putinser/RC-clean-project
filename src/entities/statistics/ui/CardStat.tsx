import {Text} from 'react-native';
import {Card} from 'heroui-native/card';
import {cn} from '@shared/lib/cn';

type TextVariantKey = 'first' | 'second' | 'third';

type CardStatProps = {
  text: string;
  description: string;
  textVariant: TextVariantKey;
};

const textVariants: Record<TextVariantKey, string> = {
  first: 'text-[#E4EAF3] text-[36px] font-extrabold leading-none',
  second: 'text-[#53CA92] text-[36px] font-extrabold leading-none',
  third: 'text-[#56D1FB] text-[36px] font-extrabold leading-none',
};

export const CardStat = ({
  text,
  description,
  textVariant,
}: CardStatProps) => {
  return (
    <Card className="w-full bg-[#0F1115] border border-[#464B52] rounded-2xl p-6">
      <Card.Header className="gap-3">
        <Text className={cn(textVariants[textVariant])}>{text}</Text>
        <Text className="text-[#A6AAB2] text-base font-normal leading-none">
          {description}
        </Text>
      </Card.Header>
    </Card>
  );
};
