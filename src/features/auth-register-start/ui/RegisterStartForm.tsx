import {useState} from 'react';
import {View, Text} from 'react-native';
import {AuthInput} from '@shared/ui/AuthInput';
import {AuthSubmitButton} from '@shared/ui/AuthSubmitButton';
import {serviceAuth} from '@services/auth';
import {useAuthNavigation} from '@widgets/auth-popup/model/useAuthNavigation';
import {AuthPopupState} from '@widgets/auth-popup/model/authPopupState';
import {useAuthPopupStore} from '@widgets/auth-popup/model/useAuthPopupStore';
import {authFormStyles} from '@shared/lib/authFormStyles';

export const RegisterStartForm = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [touched, setTouched] = useState(false);

  const setFormInvalid = useAuthPopupStore((s) => s.setFormInvalid);
  const {navigateWithAuth} = useAuthNavigation();

  const validateEmail = (value: string) => {
    if (!value.trim()) return 'Поле обязательное';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()))
      return 'Некорректный email';
    return '';
  };

  const handleSubmit = async () => {
    if (isSuccess) {
      navigateWithAuth(AuthPopupState.CLOSED);
      return;
    }

    setTouched(true);
    const err = validateEmail(email);
    setEmailError(err);
    setFormInvalid(!!err);
    if (err) return;

    setLoading(true);
    setSubmitError('');

    try {
      const {data} = await serviceAuth.registerStart({email: email.trim()});
      if (data.success) {
        setIsSuccess(true);
      }
    } catch {
      setSubmitError('Не удалось отправить письмо для продолжения регистрации...');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={authFormStyles.root}>
      {isSuccess ? (
        <Text style={authFormStyles.successText}>
          Письмо с ссылкой для продолжения регистрации отправлено на {email}
        </Text>
      ) : (
        <View style={authFormStyles.field}>
          <AuthInput
          placeholder="Email"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            if (touched) setEmailError(validateEmail(text));
          }}
          onBlur={() => {
            setTouched(true);
            const err = validateEmail(email);
            setEmailError(err);
            setFormInvalid(!!err);
          }}
          error={touched ? emailError : undefined}
          isValid={!!email && !emailError}
          editable={!isSuccess}
          autoComplete="email"
        />
        </View>
      )}

      {submitError ? (
        <Text style={authFormStyles.error}>{submitError}</Text>
      ) : null}

      <AuthSubmitButton
        onPress={handleSubmit}
        loading={loading}
        disabled={!isSuccess && !email}>
        {isSuccess ? 'Закрыть' : 'Зарегистрироваться'}
      </AuthSubmitButton>
    </View>
  );
};
