import {useNavigation} from '@react-navigation/native';
import {useCallback} from 'react';
import type {AppStackNavigation} from '@shared/types/navigation';
import {
  AuthPopupState,
  type AuthNavParams,
} from '@widgets/auth-popup/model/authPopupState';

export const useAuthNavigation = () => {
  const navigation = useNavigation<AppStackNavigation>();

  const navigateWithAuth = useCallback(
    (state: AuthPopupState, extra?: {token?: string; resetId?: string}) => {
      const params: AuthNavParams = {state, ...extra};
      navigation.navigate('Auth', params);
    },
    [navigation],
  );

  const goHome = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }
    navigation.navigate('Main', {screen: 'Home'});
  }, [navigation]);

  return {navigateWithAuth, goHome};
};
