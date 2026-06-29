import {ScrollView, View} from 'react-native';
import {useScrollToTop} from '@react-navigation/native';
import {useCallback, useEffect, useRef, useState} from 'react';
import {Header} from './Header';
import {Hero} from './Hero';
import {CardStats} from './CardStats';
import {HowItWorks} from './HowItWorks';
import {Capabilities} from './Capabilities';
import {Tariffs} from './Tariffs';
import {Footer} from './Footer';
import {useLandingScrollStore} from '../model/landingScroll';

export const HomeScreen = () => {
  const ref = useRef<ScrollView>(null);
  const sectionOffsets = useRef<Record<string, number>>({});
  const [layoutReady, setLayoutReady] = useState(false);
  const pendingAnchor = useLandingScrollStore((s) => s.pendingAnchor);
  const setPendingAnchor = useLandingScrollStore((s) => s.setPendingAnchor);

  useScrollToTop(ref);

  const registerSection = useCallback((anchor: string, y: number) => {
    sectionOffsets.current[anchor] = y;
    setLayoutReady((value) => value || true);
  }, []);

  useEffect(() => {
    if (!pendingAnchor) {
      return;
    }

    const offset = sectionOffsets.current[pendingAnchor];
    if (offset == null) {
      return;
    }

    ref.current?.scrollTo({y: offset, animated: true});
    setPendingAnchor(null);
  }, [pendingAnchor, layoutReady, setPendingAnchor]);

  return (
    <ScrollView
      ref={ref}
      className="flex-1 bg-background"
      contentContainerClassName="pb-24"
      bounces={false}>
      <Header />
      <View className="flex-1">
        <Hero />
        <CardStats />
        <View
          onLayout={(event) =>
            registerSection('how-it-works', event.nativeEvent.layout.y)
          }>
          <HowItWorks />
        </View>
        <View
          onLayout={(event) =>
            registerSection('capabilities', event.nativeEvent.layout.y)
          }>
          <Capabilities />
        </View>
        <View
          onLayout={(event) =>
            registerSection('tariffs', event.nativeEvent.layout.y)
          }>
          <Tariffs />
        </View>
      </View>
      <Footer />
    </ScrollView>
  );
};
