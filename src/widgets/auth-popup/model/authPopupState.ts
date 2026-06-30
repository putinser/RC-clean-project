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

export const AUTH_STATE_SUBTITLES: Partial<Record<AuthPopupState, string>> = {
  [AuthPopupState.LOGIN]: 'Войдите, чтобы открыть полный доступ к аналитике',
  [AuthPopupState.REGISTER_START]:
    'Создайте аккаунт и начните работу с данными биржи',
  [AuthPopupState.REGISTER_CONTINUE]:
    'Завершите регистрацию и задайте пароль',
  [AuthPopupState.RESET_PASSWORD_START]:
    'Укажите email — отправим ссылку для восстановления',
  [AuthPopupState.RESET_PASSWORD_CONTINUE]: 'Придумайте новый пароль для входа',
};

export type AuthNavParams = {
  state: AuthPopupState;
  token?: string;
  resetId?: string;
};

export const AUTH_ROUTE = 'Auth';
