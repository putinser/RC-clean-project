import {Button} from 'heroui-native/button';
import type {ButtonRootProps} from 'heroui-native/button';

type MainButtonProps = {
  text: string;
  onPress?: () => void;
  className?: string;
} & Partial<Pick<ButtonRootProps, 'isDisabled' | 'size'>>;

export const MainButton = ({
  text,
  onPress,
  className,
  isDisabled,
  size,
}: MainButtonProps) => {
  return (
    <Button
      variant="primary"
      onPress={onPress}
      isDisabled={isDisabled}
      size={size}
      className={className}>
      <Button.Label className="text-[#1D242E] text-base font-medium">
        {text}
      </Button.Label>
    </Button>
  );
};
