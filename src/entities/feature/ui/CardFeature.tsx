import {View} from 'react-native';
import {Card} from 'heroui-native/card';
import type {LucideIcon} from 'lucide-react-native';

type CardFeatureProps = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export const CardFeature = ({
  title,
  description,
  icon: Icon,
}: CardFeatureProps) => {
  return (
    <Card className="w-full bg-[#0F1115] border border-[#464B52] rounded-2xl p-6">
      <Card.Header className="gap-4">
        <View className="h-9 w-9 items-center justify-center rounded-full bg-[#1D363D]">
          <Icon color="#56d1fb" size={24} strokeWidth={1.75} />
        </View>
        <View className="gap-3">
          <Card.Title className="text-lg font-bold leading-snug text-foreground">
            {title}
          </Card.Title>
          <Card.Description className="text-text-secondary text-[15px] font-normal leading-normal">
            {description}
          </Card.Description>
        </View>
      </Card.Header>
    </Card>
  );
};
