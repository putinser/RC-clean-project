import {useState} from 'react';
import {View, Text} from 'react-native';
import {AuthInput} from '@shared/ui/AuthInput';
import {AuthSubmitButton} from '@shared/ui/AuthSubmitButton';
import {serviceAuth} from '@services/auth';
import {useAuthNavigation} from '@widgets/auth-popup/model/useAuthNavigation';
import {AuthPopupState} from '@widgets/auth-popup/model/authPopupState';
import {useAuthPopupStore} from '@widgets/auth-popup/model/useAuthPopupStore';

const PASSWORD_PATTERN = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,}$/;

type ResetPasswordContinueFormProps = {
  resetId: string;
};

export const ResetPasswordContinueForm = ({
  resetId,
}: ResetPasswordContinueFormProps) => {
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [touched, setTouched] = useState(false);

  const setFormInvalid = useAuthPopupStore((s) => s.setFormInvalid);
  const {navigateWithAuth} = useAuthNavigation();

  const validatePassword = (value: string) => {
    if (!value) return 'Поле обязательное';
    if (value.length < 4) return 'Минимальная длина пароля 4 символа';
    if (!PASSWORD_PATTERN.test(value)) {
      return 'Пароль должен содержать заглавные, строчные буквы и цифры';
    }
    return '';
  };

  const handleSubmit = async () => {
    if (isSuccess) {
      navigateWithAuth(AuthPopupState.LOGIN);
      return;
    }

    setTouched(true);
    const err = validatePassword(password);
    setPasswordError(err);
    setFormInvalid(!!err);
    if (err || !resetId) return;

    setLoading(true);
    setSubmitError('');

    try {
      const response = await serviceAuth.resetPasswordContinue({
        code: resetId,
        password: password.trim(),
      });
      if (response.success) {
        setIsSuccess(true);
      }
    } catch {
      setSubmitError('Не удалось сменить пароль...');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="w-full gap-4">
      {isSuccess ? (
        <Text className="text-center text-sm text-text-secondary">
          Пароль успешно изменён. Теперь вы можете войти.
        </Text>
      ) : (
        <AuthInput
          isPassword
          placeholder="Новый пароль"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            if (touched) setPasswordError(validatePassword(text));
          }}
          onBlur={() => {
            setTouched(true);
            const err = validatePassword(password);
            setPasswordError(err);
            setFormInvalid(!!err);
          }}
          error={touched ? passwordError : undefined}
          isValid={!!password && !passwordError}
          autoComplete="password-new"
        />
      )}

      {submitError ? (
        <Text className="text-[13px] text-[#ec1c1c] text-center">
          {submitError}
        </Text>
      ) : null}

      <AuthSubmitButton
        onPress={handleSubmit}
        loading={loading}
        disabled={!isSuccess && !password}>
        {isSuccess ? 'Войти' : 'Сохранить пароль'}
      </AuthSubmitButton>
    </View>
  );
};
