import {Pressable} from 'react-native';
import {Eye, EyeOff} from 'lucide-react-native';
import {cn} from '@shared/lib/cn';

type ChartShowPriceButtonProps = {
  showPrice: boolean;
  onToggle: () => void;
  compact?: boolean;
};

export const ChartShowPriceButton = ({
  showPrice,
  onToggle,
  compact = false,
}: ChartShowPriceButtonProps) => (
  <Pressable
    onPress={onToggle}
    accessibilityRole="button"
    accessibilityLabel={
      showPrice ? 'Не показывать цену актива' : 'Показывать цену актива'
    }
    className={cn(
      'items-center justify-center rounded-lg border border-[#21262d] bg-[#0F1115]/95',
      compact ? 'h-8 w-8' : 'h-9 w-9',
    )}>
    {showPrice ? (
      <Eye size={compact ? 16 : 18} color="#87A3AB" />
    ) : (
      <EyeOff size={compact ? 16 : 18} color="#87A3AB" />
    )}
  </Pressable>
);
