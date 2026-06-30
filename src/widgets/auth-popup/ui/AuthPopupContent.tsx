import {View, Text, Pressable, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ArrowLeft, CheckCircle2} from 'lucide-react-native';
import {AuthBrandMark} from './AuthBrandMark';
import {AuthTabs} from './AuthTabs';
import {AuthTabPromo} from './AuthTabPromo';
import {LoginForm} from '@features/auth-login';
import {RegisterStartForm} from '@features/auth-register-start';
import {RegisterContinueForm} from '@features/auth-register-continue';
import {ResetPasswordForm} from '@features/auth-reset-password';
import {ResetPasswordContinueForm} from '@features/auth-reset-password-continue';
import {AuthSubmitButton} from '@shared/ui/AuthSubmitButton';
import {
  AUTH_STATE_SUBTITLES,
  AUTH_STATE_TITLES,
  AuthPopupState,
} from '../model/authPopupState';
import {useUserStore} from '@entities/user';
import {useAuthPopupStore} from '../model/useAuthPopupStore';
import {useAuthNavigation} from '../model/useAuthNavigation';
import {authPopupStyles} from '@shared/lib/authFormStyles';

type AuthPopupContentProps = {
  state: AuthPopupState;
  token?: string;
  resetId?: string;
};

export const AuthPopupContent = ({
  state,
  token,
  resetId,
}: AuthPopupContentProps) => {
  const currentUser = useUserStore((s) => s.currentUser);
  const isFormInvalid = useAuthPopupStore((s) => s.isFormInvalid);
  const {navigateWithAuth, goHome} = useAuthNavigation();

  if (state === AuthPopupState.CLOSED) {
    return null;
  }

  const isHello = state === AuthPopupState.HELLO;
  const isResetPassword =
    state === AuthPopupState.RESET_PASSWORD_START ||
    state === AuthPopupState.RESET_PASSWORD_CONTINUE;
  const showTabs =
    state === AuthPopupState.LOGIN ||
    state === AuthPopupState.REGISTER_START;
  const showBackToLogin =
    isResetPassword || state === AuthPopupState.REGISTER_CONTINUE;
  const subtitle = AUTH_STATE_SUBTITLES[state];
  const privacyLabel =
    state === AuthPopupState.REGISTER_START ||
    state === AuthPopupState.REGISTER_CONTINUE
      ? 'Зарегистрироваться'
      : 'Войти';

  if (isHello) {
    return (
      <SafeAreaView style={authPopupStyles.screen} edges={['top', 'bottom']}>
        <View style={authPopupStyles.helloScreen}>
          <View style={authPopupStyles.card}>
            <View style={styles.hello}>
              <View style={authPopupStyles.helloIconWrap}>
                <CheckCircle2 color="#1BCD54" size={32} strokeWidth={1.75} />
              </View>
              <Text style={authPopupStyles.helloTitle}>
                Добро пожаловать,{' '}
                <Text style={authPopupStyles.helloName}>
                  {currentUser?.name ?? ''}
                </Text>
              </Text>
              <Text style={authPopupStyles.helloSubtitle}>
                Сессия активна — можно работать с графиками и данными
              </Text>
              
              {/* <View style={styles.helloBrand}>
                <AuthBrandMark compact />
              </View> */}
              <AuthSubmitButton onPress={goHome} style={authPopupStyles.helloButton}>
                На главную
              </AuthSubmitButton>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={authPopupStyles.screen} edges={['top', 'bottom']}>
      <View style={authPopupStyles.padding}>
        <View
          style={[
            authPopupStyles.card,
            isFormInvalid && authPopupStyles.cardInvalid,
          ]}>
              <View style={authPopupStyles.section}>
                <AuthBrandMark />
              </View>

              <View style={authPopupStyles.section}>
                <Text style={authPopupStyles.title}>
                  {AUTH_STATE_TITLES[state]}
                </Text>
                {subtitle ? (
                  <Text style={authPopupStyles.subtitle}>{subtitle}</Text>
                ) : null}
              </View>

              {showTabs ? (
                <>
                  <View style={authPopupStyles.section}>
                    <AuthTabs
                      active={
                        state === AuthPopupState.LOGIN
                          ? AuthPopupState.LOGIN
                          : AuthPopupState.REGISTER_START
                      }
                    />
                  </View>
                  <View style={authPopupStyles.section}>
                    <AuthTabPromo
                      state={
                        state === AuthPopupState.LOGIN
                          ? AuthPopupState.LOGIN
                          : AuthPopupState.REGISTER_START
                      }
                    />
                  </View>
                </>
              ) : null}

              {showBackToLogin ? (
                <Pressable
                  onPress={() => navigateWithAuth(AuthPopupState.LOGIN)}
                  style={authPopupStyles.backRow}>
                  <ArrowLeft color="#a6aab2" size={16} />
                  <Text style={authPopupStyles.backText}>Вернуться ко входу</Text>
                </Pressable>
              ) : null}

              {state === AuthPopupState.LOGIN ? <LoginForm /> : null}
              {state === AuthPopupState.REGISTER_START ? (
                <RegisterStartForm />
              ) : null}
              {state === AuthPopupState.REGISTER_CONTINUE ? (
                <RegisterContinueForm token={token ?? ''} />
              ) : null}
              {state === AuthPopupState.RESET_PASSWORD_START ? (
                <ResetPasswordForm />
              ) : null}
              {state === AuthPopupState.RESET_PASSWORD_CONTINUE ? (
                <ResetPasswordContinueForm resetId={resetId ?? ''} />
              ) : null}

              {showTabs || state === AuthPopupState.REGISTER_CONTINUE ? (
                <Text style={authPopupStyles.privacy}>
                  Нажимая «{privacyLabel}», вы соглашаетесь с{' '}
                  <Text style={authPopupStyles.privacyLink}>
                    политикой обработки персональных данных
                  </Text>
                  .
                </Text>
              ) : null}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  hello: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  helloBrand: {
    marginTop: 20,
  },
});
