import {useEffect, useRef} from 'react';
import {useUserStore} from '@entities/user';
import {prefetchDefaultChart} from '../lib/prefetchDefaultChart';

export function ChartPrefetchInit() {
  const loadingStatus = useUserStore((state) => state.loadingStatus);
  const isAuthorized = useUserStore((state) => state.isAuthorized);
  const prefetchStartedRef = useRef(false);

  useEffect(() => {
    if (loadingStatus !== 'loaded' || prefetchStartedRef.current) {
      return;
    }

    prefetchStartedRef.current = true;
    prefetchDefaultChart(isAuthorized).catch(() => {});
  }, [loadingStatus, isAuthorized]);

  return null;
}
