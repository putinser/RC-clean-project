import {storage} from '@shared/lib/storage';
import {STORAGE_KEYS} from '@shared/lib/storageKeys';
import type {AuthTokens} from '@services/auth/types';
import type {UserAuthData} from '@services/user/types';

export const tokenStorage = {
  get(): Promise<AuthTokens | null> {
    return storage.getItem<AuthTokens>(STORAGE_KEYS.TOKENS);
  },

  set(tokens: AuthTokens): Promise<void> {
    return storage.setItem(STORAGE_KEYS.TOKENS, tokens);
  },

  clear(): Promise<void> {
    return storage.removeItem(STORAGE_KEYS.TOKENS);
  },
};

export const userStorage = {
  get(): Promise<UserAuthData | null> {
    return storage.getItem<UserAuthData>(STORAGE_KEYS.USER);
  },

  set(user: UserAuthData): Promise<void> {
    return storage.setItem(STORAGE_KEYS.USER, user);
  },

  clear(): Promise<void> {
    return storage.removeItem(STORAGE_KEYS.USER);
  },

  isAuthorized(): Promise<boolean> {
    return storage.getItem<number>(STORAGE_KEYS.AUTHORIZED).then(
      (flag) => flag === 1,
    );
  },

  setAuthorized(value: boolean): Promise<void> {
    if (value) {
      return storage.setItem(STORAGE_KEYS.AUTHORIZED, 1);
    }
    return storage.removeItem(STORAGE_KEYS.AUTHORIZED);
  },

  async clearAll(): Promise<void> {
    await Promise.all([
      this.clear(),
      tokenStorage.clear(),
      this.setAuthorized(false),
    ]);
  },
};
