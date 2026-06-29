import {View, Text} from 'react-native';
import {Card} from 'heroui-native/card';
import {Button} from 'heroui-native/button';
import {Check} from 'lucide-react-native';
import {cn} from '@shared/lib/cn';

type TariffCardVariant = 'default' | 'primary';

export type TariffCardProps = {
  title: string;
  description: string;
  price: string;
  priceDetail: string;
  features: readonly string[];
  buttonText: string;
  variant?: TariffCardVariant;
  recommended?: boolean;
  className?: string;
  onPress?: () => void;
};

export const TariffCard = ({
  title,
  description,
  price,
  priceDetail,
  features,
  buttonText,
  variant = 'default',
  recommended = false,
  className,
  onPress,
}: TariffCardProps) => {
  return (
    <Card
      className={cn(
        'flex-col bg-[#0F1115] border border-[#464B52] rounded-2xl p-6',
        className,
      )}>
      <Card.Header className="gap-5 p-0">
        {recommended ? (
          <View className="self-start bg-[#181B22] rounded-full border border-[#8B6326] px-3.5 py-1">
            <Text className="text-[12px] font-medium tracking-wide text-[#FFAA2B]">
              рекомендуемый
            </Text>
          </View>
        ) : null}

        <View className="gap-4">
          <Card.Title className="text-[22px] text-[#E8ECF3] font-bold leading-none">
            {title}
          </Card.Title>
          <Card.Description className="text-text-secondary text-[15px] font-normal leading-snug">
            {description}
          </Card.Description>
        </View>

        <View className="gap-1">
          <Text className="font-numeric text-[34px] font-extrabold leading-none text-foreground">
            {price}
          </Text>
          <Text className="text-[#686B72] text-[12px]">{priceDetail}</Text>
        </View>

        <View className="gap-3">
          {features.map((feature) => (
            <View
              key={feature}
              className="flex-row items-start gap-2.5">
              <Check
                color="#f4f8ff"
                size={16}
                strokeWidth={2}
                className="mt-0.5 shrink-0"
              />
              <Text className="flex-1 text-sm leading-snug text-text-secondary font-normal">
                {feature}
              </Text>
            </View>
          ))}
        </View>
      </Card.Header>

      <Card.Footer className="pt-6 p-0 mt-6">
        <Button
          variant={variant === 'primary' ? 'primary' : 'outline'}
          onPress={onPress}
          className={cn(
            'w-full h-[46px] rounded-2xl',
            variant === 'primary' ? 'gradient-primary' : 'bg-[#181B22]',
          )}>
          <Button.Label
            className={cn(
              'text-base font-medium',
              variant === 'primary' ? 'text-[#1D242E]' : 'text-foreground',
            )}>
            {buttonText}
          </Button.Label>
        </Button>
      </Card.Footer>
    </Card>
  );
};
