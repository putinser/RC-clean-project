import {useState} from 'react';
import {View, Text, Pressable} from 'react-native';
import {AuthInput} from '@shared/ui/AuthInput';
import {AuthSubmitButton} from '@shared/ui/AuthSubmitButton';
import {useUserStore} from '@entities/user';
import {serviceAuth} from '@services/auth';
import {getAuthErrorMessage} from '@shared/lib/authErrors';
import {ApiError} from '@services/api';
import {useAuthNavigation} from '@widgets/auth-popup/model/useAuthNavigation';
import {AuthPopupState} from '@widgets/auth-popup/model/authPopupState';
import {useAuthPopupStore} from '@widgets/auth-popup/model/useAuthPopupStore';
import {authFormStyles, authPopupStyles} from '@shared/lib/authFormStyles';

export const LoginForm = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({login: false, password: false});

  const setFormInvalid = useAuthPopupStore((s) => s.setFormInvalid);
  const authorize = useUserStore((s) => s.authorize);
  const {navigateWithAuth} = useAuthNavigation();

  const validateLogin = (value: string) => {
    if (!value.trim()) return 'Поле обязательное';
    return '';
  };

  const validatePassword = (value: string) => {
    if (!value) return 'Поле обязательное';
    if (value.length < 4) return 'Минимальная длина пароля 4 символа';
    return '';
  };

  const handleSubmit = async () => {
    setTouched({login: true, password: true});

    const loginErr = validateLogin(login);
    const passwordErr = validatePassword(password);
    setLoginError(loginErr);
    setPasswordError(passwordErr);
    setFormInvalid(!!loginErr || !!passwordErr);

    if (loginErr || passwordErr) return;

    setLoading(true);
    setSubmitError('');

    try {
      const {data, tokens} = await serviceAuth.login({
        login: login.trim(),
        password: password.trim(),
      });

      if (data.success && data.data && tokens) {
        await authorize(data.data, tokens);
        navigateWithAuth(AuthPopupState.HELLO);
      }
    } catch (error) {
      const message = getAuthErrorMessage(error, 'Не удалось выполнить вход...');
      setSubmitError(message);
      if (
        error instanceof ApiError &&
        error.data &&
        typeof error.data === 'object' &&
        'error' in error.data
      ) {
        const apiError = (error.data as {error: {id?: string}}).error;
        if (apiError?.id === '1000') {
          setLoginError(message);
          setPasswordError(message);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={authFormStyles.root}>
      <View style={authFormStyles.field}>
        <AuthInput
          placeholder="Email"
          value={login}
          onChangeText={(text) => {
            setLogin(text);
            if (touched.login) setLoginError(validateLogin(text));
          }}
          onBlur={() => {
            setTouched((t) => ({...t, login: true}));
            const err = validateLogin(login);
            setLoginError(err);
            setFormInvalid(!!err);
          }}
          error={touched.login ? loginError : undefined}
          isValid={!!login && !loginError}
          autoComplete="username"
        />
      </View>

      <View style={authFormStyles.field}>
        <AuthInput
          isPassword
          placeholder="Пароль, не менее 4 символов"
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
          autoComplete="password"
        />
      </View>

      <Pressable
        onPress={() => navigateWithAuth(AuthPopupState.RESET_PASSWORD_START)}
        style={authFormStyles.linkWrap}>
        <Text style={authFormStyles.link}>Забыл пароль</Text>
      </Pressable>

      {submitError ? (
        <Text style={authFormStyles.error}>{submitError}</Text>
      ) : null}

      <AuthSubmitButton
        onPress={handleSubmit}
        loading={loading}
        disabled={!login || !password}>
        Войти
      </AuthSubmitButton>
    </View>
  );
};
