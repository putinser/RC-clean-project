import {Pressable, Text, ActivityIndicator, type ViewStyle} from 'react-native';
import {primaryButtonStyles} from '@shared/lib/primaryButtonStyles';

type AuthSubmitButtonProps = {
  children: string;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  onPress: () => void;
};

export const AuthSubmitButton = ({
  children,
  disabled,
  loading,
  style,
  onPress,
}: AuthSubmitButtonProps) => {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={[
        primaryButtonStyles.button,
        style,
        isDisabled && primaryButtonStyles.buttonDisabled,
      ]}>
      {loading ? (
        <ActivityIndicator color="#1D242E" />
      ) : (
        <Text style={primaryButtonStyles.label}>{children}</Text>
      )}
    </Pressable>
  );
};
