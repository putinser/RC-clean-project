import {useEffect} from 'react';
import Orientation from 'react-native-orientation-locker';

export const useChartLandscapeMode = (enabled: boolean) => {
  useEffect(() => {
    if (enabled) {
      Orientation.lockToLandscape();
      return;
    }

    Orientation.lockToPortrait();
  }, [enabled]);

  useEffect(() => {
    return () => {
      Orientation.lockToPortrait();
    };
  }, []);
};
