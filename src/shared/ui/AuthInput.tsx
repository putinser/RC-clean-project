import {useState} from 'react';
import {View, Text, TextInput, Pressable} from 'react-native';
import {Eye, EyeOff} from 'lucide-react-native';
import {cn} from '@shared/lib/cn';

type AuthInputProps = {
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  error?: string;
  isValid?: boolean;
  isPassword?: boolean;
  autoComplete?: string;
  keyboardType?: 'default' | 'email-address' | 'visible-password';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  className?: string;
  editable?: boolean;
};

export const AuthInput = ({
  value,
  onChangeText,
  onBlur,
  placeholder,
  error,
  isValid,
  isPassword,
  autoComplete,
  keyboardType,
  autoCapitalize = 'none',
  className,
  editable = true,
}: AuthInputProps) => {
  const [visible, setVisible] = useState(false);
  const isSecure = isPassword && !visible;

  return (
    <View className="w-full">
      <View className="relative w-full">
        <TextInput
          value={value}
          onChangeText={onChangeText}
          onBlur={onBlur}
          placeholder={placeholder}
          placeholderTextColor="#a6aab2"
          secureTextEntry={isSecure}
          autoComplete={autoComplete as never}
          keyboardType={keyboardType ?? (isPassword ? 'default' : 'email-address')}
          autoCapitalize={autoCapitalize}
          editable={editable}
          className={cn(
            'h-12 px-4 rounded-[14px] border bg-[#181b22] text-foreground text-[15px]',
            error ? 'border-[#ec1c1c]' : isValid ? 'border-[#1bcd54]' : 'border-[#464b52]',
            isPassword && 'pr-12',
            className,
          )}
        />
        {isPassword ? (
          <Pressable
            onPress={() => setVisible((v) => !v)}
            className="absolute right-4 top-0 bottom-0 items-center justify-center"
            accessibilityLabel={visible ? 'Скрыть пароль' : 'Показать пароль'}>
            {visible ? (
              <EyeOff color="#a6aab2" size={20} />
            ) : (
              <Eye color="#a6aab2" size={20} />
            )}
          </Pressable>
        ) : null}
      </View>
      {error ? (
        <Text className="mt-1.5 text-[13px] text-[#ec1c1c]">{error}</Text>
      ) : null}
    </View>
  );
};
