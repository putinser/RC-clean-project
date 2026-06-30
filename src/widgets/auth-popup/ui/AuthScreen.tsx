import {useEffect} from 'react';
import {
  useNavigation,
  useRoute,
  type RouteProp,
} from '@react-navigation/native';
import {View, Text} from 'react-native';
import type {AppStackParamList, AppStackNavigation} from '@shared/types/navigation';
import {useUserStore} from '@entities/user';
import {AuthPopupState} from '../model/authPopupState';
import {AuthPopupContent} from './AuthPopupContent';

import {authPopupStyles} from '@shared/lib/authFormStyles';

export const AuthScreen = () => {
  const navigation = useNavigation<AppStackNavigation>();
  const route = useRoute<RouteProp<AppStackParamList, 'Auth'>>();
  const isAuthorized = useUserStore((s) => s.isAuthorized);
  const loadingStatus = useUserStore((s) => s.loadingStatus);

  const state = route.params?.state ?? AuthPopupState.CLOSED;

  useEffect(() => {
    if (state === AuthPopupState.CLOSED) {
      if (navigation.canGoBack()) {
        navigation.goBack();
      } else {
        navigation.navigate('Main', {screen: 'Home'});
      }
    }
  }, [state, navigation]);

  useEffect(() => {
    if (isAuthorized && state !== AuthPopupState.HELLO) {
      if (navigation.canGoBack()) {
        navigation.goBack();
      } else {
        navigation.navigate('Main', {screen: 'Home'});
      }
    }
  }, [isAuthorized, state, navigation]);

  if (loadingStatus === 'initial') {
    return (
      <View style={authPopupStyles.loading}>
        <Text style={authPopupStyles.loadingText}>Загрузка...</Text>
      </View>
    );
  }

  if (
    state === AuthPopupState.CLOSED ||
    (isAuthorized && state !== AuthPopupState.HELLO)
  ) {
    return (
      <View style={authPopupStyles.loading}>
        <Text style={authPopupStyles.loadingText}>Загрузка...</Text>
      </View>
    );
  }

  return (
    <View style={authPopupStyles.screen}>
      <AuthPopupContent
        state={state}
        token={route.params?.token}
        resetId={route.params?.resetId}
      />
    </View>
  );
};
