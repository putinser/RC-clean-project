import {Pressable, Text, type ViewStyle} from 'react-native';
import {primaryButtonStyles} from '@shared/lib/primaryButtonStyles';

type MainButtonProps = {
  text: string;
  onPress?: () => void;
  style?: ViewStyle;
  isDisabled?: boolean;
};

export const MainButton = ({text, onPress, style, isDisabled}: MainButtonProps) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={[
        primaryButtonStyles.button,
        style,
        isDisabled && primaryButtonStyles.buttonDisabled,
      ]}>
      <Text style={primaryButtonStyles.label}>{text}</Text>
    </Pressable>
  );
};
