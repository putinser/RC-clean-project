import {create} from 'zustand';
import {serviceAuth} from '@services/auth';
import type {AuthTokens} from '@services/auth/types';
import {serviceUser} from '@services/user';
import type {UserAuthData} from '@services/user/types';
import {tokenStorage, userStorage} from '@shared/lib/userStorage';
import type {LoadingStatus} from './types';

type UserState = {
  currentUser: UserAuthData | null;
  isAuthorized: boolean;
  loadingStatus: LoadingStatus;
  authorize: (user: UserAuthData, tokens: AuthTokens) => Promise<void>;
  restoreSession: () => Promise<void>;
  logout: () => void;
};

export const useUserStore = create<UserState>((set, get) => ({
  currentUser: null,
  isAuthorized: false,
  loadingStatus: 'initial',

  authorize: async (user, tokens) => {
    await Promise.all([
      userStorage.set(user),
      userStorage.setAuthorized(true),
      tokenStorage.set(tokens),
    ]);
    set({currentUser: user, isAuthorized: true});
  },

  restoreSession: async () => {
    const status = get().loadingStatus;
    set({loadingStatus: status === 'initial' ? 'initial' : 'loading'});

    const authorized = await userStorage.isAuthorized();
    if (!authorized) {
      set({loadingStatus: 'loaded', isAuthorized: false, currentUser: null});
      return;
    }

    const storedUser = await userStorage.get();
    if (
      storedUser?.id &&
      storedUser.name &&
      storedUser.email &&
      storedUser.role
    ) {
      set({isAuthorized: true, currentUser: storedUser});
    } else {
      await userStorage.clearAll();
      set({isAuthorized: false, currentUser: null, loadingStatus: 'loaded'});
      return;
    }

    try {
      const response = await serviceUser.me();
      if (response.success && response.data) {
        await userStorage.set(response.data);
        set({
          currentUser: response.data,
          isAuthorized: true,
          loadingStatus: 'loaded',
        });
        return;
      }
    } catch {
      await userStorage.clearAll();
      set({isAuthorized: false, currentUser: null});
    }

    set({loadingStatus: 'loaded'});
  },

  logout: () => {
    serviceAuth.logout();
    userStorage.clearAll();
    set({currentUser: null, isAuthorized: false});
  },
}));
