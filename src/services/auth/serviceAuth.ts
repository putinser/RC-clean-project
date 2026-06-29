import {api} from '@services/api';
import type {
  LoginPayload,
  LoginResponse,
  LogoutResponse,
  RegisterContinuePayload,
  RegisterContinueResponse,
  RegisterStartPayload,
  RegisterStartResponse,
  ResetPasswordContinuePayload,
  ResetPasswordContinueResponse,
  ResetPasswordStartPayload,
  ResetPasswordStartResponse,
} from './types';

export const serviceAuth = {
  login: (payload: LoginPayload) =>
    api.postWithTokens<LoginResponse>('/auth/login', payload),

  logout: () => {
    api.post<LogoutResponse>('/auth/logout', {}).catch(() => undefined);
  },

  registerStart: (payload: RegisterStartPayload) =>
    api.postWithTokens<RegisterStartResponse>('/register/email', payload),

  registerContinue: (payload: RegisterContinuePayload) =>
    api.postWithTokens<RegisterContinueResponse>(
      '/register/finish',
      payload,
    ),

  resetPasswordStart: async (payload: ResetPasswordStartPayload) => {
    const response = await api.post<ResetPasswordStartResponse>(
      '/password/email',
      payload,
    );
    return response.data;
  },

  resetPasswordContinue: async (payload: ResetPasswordContinuePayload) => {
    const response = await api.post<ResetPasswordContinueResponse>(
      '/password/reset',
      payload,
    );
    return response.data;
  },
};
