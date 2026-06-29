import type {ApiResponse} from '@shared/types/api';
import type {UserAuthData} from '@services/user/types';

export type LoginPayload = {
  login: string;
  password: string;
};

export type RegisterStartPayload = {
  email: string;
};

export type RegisterContinuePayload = {
  token: string;
  name: string;
  password: string;
};

export type ResetPasswordStartPayload = {
  email: string;
};

export type ResetPasswordContinuePayload = {
  code: string;
  password: string;
};

export type LoginResponse = ApiResponse<UserAuthData>;
export type RegisterStartResponse = ApiResponse<unknown>;
export type RegisterContinueResponse = ApiResponse<UserAuthData>;
export type ResetPasswordStartResponse = ApiResponse<unknown>;
export type ResetPasswordContinueResponse = ApiResponse<unknown>;
export type LogoutResponse = ApiResponse<unknown>;

export type AuthTokens = {
  access: string;
  refresh: string;
};
