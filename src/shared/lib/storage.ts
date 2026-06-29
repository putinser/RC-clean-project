import AsyncStorage from '@react-native-async-storage/async-storage';

export const storage = {
  async getItem<T>(key: string): Promise<T | null> {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return raw as unknown as T;
    }
  },

  async setItem<T>(key: string, value: T): Promise<void> {
    const raw = typeof value === 'string' ? value : JSON.stringify(value);
    await AsyncStorage.setItem(key, raw);
  },

  async removeItem(key: string): Promise<void> {
    await AsyncStorage.removeItem(key);
  },
};
