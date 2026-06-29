export enum AuthPopupState {
  CLOSED = 'closed',
  LOGIN = 'login',
  REGISTER_START = 'register_start',
  REGISTER_CONTINUE = 'register_continue',
  RESET_PASSWORD_START = 'reset_start',
  RESET_PASSWORD_CONTINUE = 'reset_continue',
  HELLO = 'hello',
}

export const AUTH_STATE_TITLES: Record<AuthPopupState, string> = {
  [AuthPopupState.CLOSED]: '',
  [AuthPopupState.LOGIN]: 'Вход',
  [AuthPopupState.REGISTER_START]: 'Регистрация',
  [AuthPopupState.REGISTER_CONTINUE]: 'Завершение регистрации',
  [AuthPopupState.RESET_PASSWORD_START]: 'Сброс пароля',
  [AuthPopupState.RESET_PASSWORD_CONTINUE]: 'Новый пароль',
  [AuthPopupState.HELLO]: 'Добро пожаловать',
};

export type AuthNavParams = {
  state: AuthPopupState;
  token?: string;
  resetId?: string;
};

export const AUTH_ROUTE = 'Auth';
