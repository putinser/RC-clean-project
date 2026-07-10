import {useEffect, useState} from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {StatusBar} from 'react-native';
import {HeroUINativeProvider} from 'heroui-native/provider';
import {NavigationContainer, DarkTheme} from '@react-navigation/native';
import {AuthSessionInit} from '@features/auth-session';
import {ChartPrefetchInit} from '@features/chart-prefetch';
import {useUserStore} from '@entities/user';
import {SplashScreen} from '@widgets/splash';
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

const MIN_SPLASH_MS = 900;

export const Providers = () => {
  const loadingStatus = useUserStore((s) => s.loadingStatus);
  const [minElapsed, setMinElapsed] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMinElapsed(true), MIN_SPLASH_MS);
    return () => clearTimeout(t);
  }, []);

  const ready = loadingStatus === 'loaded' && minElapsed;

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaProvider>
        <HeroUINativeProvider>
          <StatusBar barStyle="light-content" backgroundColor="#060b12" />
          <AuthSessionInit />
          <ChartPrefetchInit />
          {ready ? (
            <NavigationContainer theme={navTheme}>
              <RootNavigator />
            </NavigationContainer>
          ) : (
            <SplashScreen />
          )}
        </HeroUINativeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};
