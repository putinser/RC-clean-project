import {useEffect} from 'react';
import {useUserStore} from '@entities/user';

export function AuthSessionInit() {
  const restoreSession = useUserStore((s) => s.restoreSession);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  return null;
}
