import {useCallback} from 'react';
import {useNavigation} from '@react-navigation/native';
import type {LandingNavigation} from '@shared/types/navigation';
import {headerButtons} from '../config/content';
import {useLandingScrollStore} from './landingScroll';

export type HeaderNavButton = (typeof headerButtons)[number];

export const useHeaderNav = () => {
  const navigation = useNavigation<LandingNavigation>();
  const setPendingAnchor = useLandingScrollStore((s) => s.setPendingAnchor);

  const handleNavPress = useCallback(
    (button: HeaderNavButton) => {
      if ('target' in button && button.target) {
        navigation.navigate(button.target);
        return;
      }

      if ('anchor' in button && button.anchor) {
        navigation.navigate('Home');
        setPendingAnchor(button.anchor);
      }
    },
    [navigation, setPendingAnchor],
  );

  return {handleNavPress, buttons: headerButtons};
};
