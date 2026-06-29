import {Button} from 'heroui-native/button';
import {cn} from '@shared/lib/cn';

type AuthSubmitButtonProps = {
  children: string;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  onPress: () => void;
};

export const AuthSubmitButton = ({
  children,
  disabled,
  loading,
  className,
  onPress,
}: AuthSubmitButtonProps) => {
  return (
    <Button
      variant="primary"
      onPress={onPress}
      isDisabled={disabled || loading}
      className={cn('gradient-primary h-12 w-full rounded-xl', className)}>
      <Button.Label className="text-[#1D242E] text-base font-medium">
        {loading ? 'Загрузка...' : children}
      </Button.Label>
    </Button>
  );
};
