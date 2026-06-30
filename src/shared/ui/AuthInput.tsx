import {useState} from 'react';
import {View, Text, TextInput, Pressable, StyleSheet} from 'react-native';
import {Eye, EyeOff} from 'lucide-react-native';

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
  editable = true,
}: AuthInputProps) => {
  const [visible, setVisible] = useState(false);
  const isSecure = isPassword && !visible;

  const borderColor = error ? '#ec1c1c' : isValid ? '#1bcd54' : '#464b52';

  return (
    <View style={styles.root}>
      <View style={[styles.field, {borderColor}]}>
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
          style={[styles.input, isPassword && styles.inputPassword]}
        />
        {isPassword ? (
          <Pressable
            onPress={() => setVisible((v) => !v)}
            style={styles.eye}
            accessibilityLabel={visible ? 'Скрыть пароль' : 'Показать пароль'}>
            {visible ? (
              <EyeOff color="#a6aab2" size={20} />
            ) : (
              <Eye color="#a6aab2" size={20} />
            )}
          </Pressable>
        ) : null}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    width: '100%',
  },
  field: {
    width: '100%',
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    backgroundColor: '#181b22',
  },
  input: {
    flex: 1,
    height: '100%',
    color: '#f4f8ff',
    fontSize: 15,
    padding: 0,
  },
  inputPassword: {
    paddingRight: 8,
  },
  eye: {
    paddingLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    marginTop: 6,
    fontSize: 13,
    color: '#ec1c1c',
  },
});
