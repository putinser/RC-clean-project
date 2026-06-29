import type {CompositeNavigationProp, ParamListBase} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {AuthPopupState, type AuthNavParams} from '@widgets/auth-popup/model/authPopupState';

export type AppStackParamList = {
  Main:
    | undefined
    | {
        screen?: keyof MainTabParamList;
        params?: object;
      };
  Auth: AuthNavParams;
} & ParamListBase;

export type MainTabParamList = {
  Home: undefined;
  Chart: {type?: string; assetId?: number} | undefined;
  Signals: {selectedAssetId?: number} | undefined;
  Assets: {selectedAssetId?: number} | undefined;
  Tariffs: undefined;
};

export type AppStackNavigation = NativeStackNavigationProp<AppStackParamList>;
export type MainTabNavigation = BottomTabNavigationProp<MainTabParamList>;

export type LandingNavigation = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Home'>,
  NativeStackNavigationProp<AppStackParamList>
>;

export const navigateToAuth = (
  navigation: {navigate: (route: string, params?: object) => void},
  state: AuthPopupState,
  extra?: {token?: string; resetId?: string},
) => {
  if (state === AuthPopupState.CLOSED) {
    navigation.navigate('Auth', {state});
    return;
  }
  navigation.navigate('Auth', {state, ...extra});
};
