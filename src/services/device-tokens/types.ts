export type DevicePlatform = 'android' | 'ios';

export type RegisterDeviceTokenPayload = {
  token: string;
  platform: DevicePlatform;
};

export type UnregisterDeviceTokenPayload = {
  token: string;
};
