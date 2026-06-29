import Config from 'react-native-config';

export const ENV = {
  API_URL: Config?.API_URL ?? 'http://localhost:3000',
  AUTH_COOKIE_NAME: Config?.AUTH_COOKIE_NAME ?? 'access_token',
};
