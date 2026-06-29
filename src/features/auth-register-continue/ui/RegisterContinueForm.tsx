import {useState} from 'react';
import {View, Text} from 'react-native';
import {AuthInput} from '@shared/ui/AuthInput';
import {AuthSubmitButton} from '@shared/ui/AuthSubmitButton';
import {useUserStore} from '@entities/user';
import {serviceAuth} from '@services/auth';
import {getAuthErrorMessage} from '@shared/lib/authErrors';
import {useAuthNavigation} from '@widgets/auth-popup/model/useAuthNavigation';
import {AuthPopupState} from '@widgets/auth-popup/model/authPopupState';
import {useAuthPopupStore} from '@widgets/auth-popup/model/useAuthPopupStore';

const PASSWORD_PATTERN = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,}$/;

type RegisterContinueFormProps = {
  token: string;
};

export const RegisterContinueForm = ({token}: RegisterContinueFormProps) => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [nameError, setNameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({name: false, password: false});

  const setFormInvalid = useAuthPopupStore((s) => s.setFormInvalid);
  const authorize = useUserStore((s) => s.authorize);
  const {navigateWithAuth} = useAuthNavigation();

  const validateName = (value: string) => {
    if (!value.trim()) return 'Поле обязательное';
    if (value.trim().length < 4) return 'Минимальная длина 4 символа';
    return '';
  };

  const validatePassword = (value: string) => {
    if (!value) return 'Поле обязательное';
    if (value.length < 4) return 'Минимальная длина пароля 4 символа';
    if (!PASSWORD_PATTERN.test(value)) {
      return 'Пароль должен содержать заглавные, строчные буквы и цифры';
    }
    return '';
  };

  const handleSubmit = async () => {
    setTouched({name: true, password: true});

    const nameErr = validateName(name);
    const passwordErr = validatePassword(password);
    setNameError(nameErr);
    setPasswordError(passwordErr);
    setFormInvalid(!!nameErr || !!passwordErr);

    if (nameErr || passwordErr || !token) return;

    setLoading(true);
    setSubmitError('');

    try {
      const {data, tokens} = await serviceAuth.registerContinue({
        token,
        name: name.trim(),
        password: password.trim(),
      });

      if (data.success && data.data && tokens) {
        await authorize(data.data, tokens);
        navigateWithAuth(AuthPopupState.HELLO);
      }
    } catch (error) {
      setSubmitError(getAuthErrorMessage(error, 'Не удалось выполнить регистрацию...'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="w-full gap-4">
      <AuthInput
        placeholder="ФИО"
        value={name}
        onChangeText={(text) => {
          setName(text);
          if (touched.name) setNameError(validateName(text));
        }}
        onBlur={() => {
          setTouched((t) => ({...t, name: true}));
          const err = validateName(name);
          setNameError(err);
          setFormInvalid(!!err);
        }}
        error={touched.name ? nameError : undefined}
        isValid={!!name && !nameError}
        autoCapitalize="words"
      />

      <AuthInput
        isPassword
        placeholder="Пароль"
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          if (touched.password) setPasswordError(validatePassword(text));
        }}
        onBlur={() => {
          setTouched((t) => ({...t, password: true}));
          const err = validatePassword(password);
          setPasswordError(err);
          setFormInvalid(!!err);
        }}
        error={touched.password ? passwordError : undefined}
        isValid={!!password && !passwordError}
        autoComplete="password-new"
      />

      {submitError ? (
        <Text className="text-[13px] text-[#ec1c1c] text-center">
          {submitError}
        </Text>
      ) : null}

      <AuthSubmitButton
        onPress={handleSubmit}
        loading={loading}
        disabled={!name || !password || !token}>
        Зарегистрироваться
      </AuthSubmitButton>
    </View>
  );
};
