import {View, Text} from 'react-native';
import {Card} from 'heroui-native/card';

type CardStepProps = {
  title: string;
  description: string;
  step: string;
};

export const CardStep = ({title, description, step}: CardStepProps) => {
  return (
    <Card className="w-full bg-[#0F1115] border border-[#464B52] rounded-2xl p-6">
      <Card.Header>
        <Text className="text-[#56D1FB] text-[44px] font-extrabold font-numeric leading-none mb-4">
          {step}
        </Text>
        <View className="gap-3">
          <Card.Title className="text-[22px] font-bold leading-none text-foreground">
            {title}
          </Card.Title>
          <Card.Description className="text-text-secondary font-normal tracking-wide leading-normal">
            {description}
          </Card.Description>
        </View>
      </Card.Header>
    </Card>
  );
};
