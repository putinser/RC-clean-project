import {View, Text} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {AuthBrandMark} from './AuthBrandMark';
import {AuthTabs} from './AuthTabs';
import {LoginForm} from '@features/auth-login';
import {RegisterStartForm} from '@features/auth-register-start';
import {RegisterContinueForm} from '@features/auth-register-continue';
import {ResetPasswordForm} from '@features/auth-reset-password';
import {ResetPasswordContinueForm} from '@features/auth-reset-password-continue';
import {
  AUTH_STATE_TITLES,
  AuthPopupState,
} from '../model/authPopupState';
import {useUserStore} from '@entities/user';

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

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="container-main flex-1 gap-6 pt-4">
        <AuthBrandMark />

        <View className="rounded-2xl border border-[#464B52] bg-[#0F1115] p-6 gap-5">
          <Text className="text-xl font-bold text-foreground">
            {AUTH_STATE_TITLES[state]}
          </Text>

          {state === AuthPopupState.LOGIN ? (
            <>
              <AuthTabs active={AuthPopupState.LOGIN} />
              <LoginForm />
            </>
          ) : state === AuthPopupState.REGISTER_START ? (
            <>
              <AuthTabs active={AuthPopupState.REGISTER_START} />
              <RegisterStartForm />
            </>
          ) : state === AuthPopupState.REGISTER_CONTINUE ? (
            <RegisterContinueForm token={token ?? ''} />
          ) : state === AuthPopupState.RESET_PASSWORD_START ? (
            <ResetPasswordForm />
          ) : state === AuthPopupState.RESET_PASSWORD_CONTINUE ? (
            <ResetPasswordContinueForm resetId={resetId ?? ''} />
          ) : state === AuthPopupState.HELLO ? (
            <View className="gap-2">
              <Text className="text-center text-foreground text-base">
                Здравствуйте, {currentUser?.name ?? ''}!
              </Text>
              <Text className="text-center text-text-secondary text-sm">
                Вы успешно вошли в систему.
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    </SafeAreaView>
  );
};
