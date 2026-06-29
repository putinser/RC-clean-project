import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {StatusBar} from 'react-native';
import {HeroUINativeProvider} from 'heroui-native/provider';
import {NavigationContainer, DarkTheme} from '@react-navigation/native';
import {AuthSessionInit} from '@features/auth-session';
import {RootNavigator} from './navigation';

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#060b12',
    card: '#0F1115',
    border: '#464B52',
    primary: '#56d1fb',
    text: '#f4f8ff',
  },
};

export const Providers = () => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaProvider>
        <HeroUINativeProvider>
          <StatusBar barStyle="light-content" backgroundColor="#060b12" />
          <AuthSessionInit />
          <NavigationContainer theme={navTheme}>
            <RootNavigator />
          </NavigationContainer>
        </HeroUINativeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};
