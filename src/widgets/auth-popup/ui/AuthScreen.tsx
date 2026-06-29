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
        navigation.navigate('Home');
      }
    }
  }, [state, navigation]);

  if (loadingStatus === 'initial') {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text className="text-text-secondary">Загрузка...</Text>
      </View>
    );
  }

  if (isAuthorized && state !== AuthPopupState.HELLO) {
    navigation.navigate('Home');
    return null;
  }

  return (
    <View className="flex-1 bg-background">
      <AuthPopupContent
        state={state}
        token={route.params?.token}
        resetId={route.params?.resetId}
      />
    </View>
  );
};
