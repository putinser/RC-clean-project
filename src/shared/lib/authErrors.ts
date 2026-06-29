export const AUTH_ERRORS: Record<string, string> = {
  '1000': 'Неверный логин или пароль',
  '1004': 'Пользователь с указанным E-Mail уже зарегистрирован',
  '1005': 'Код подтверждения регистрации неправильный',
  '1006': 'Код подтверждения регистрации устарел',
};

export function getAuthErrorMessage(error: unknown, fallback: string): string {
  if (error && typeof error === 'object' && 'data' in error) {
    const data = (error as {data: unknown}).data;
    if (data && typeof data === 'object' && 'error' in data) {
      const apiError = (data as {error: {id?: string} | null}).error;
      if (apiError?.id && AUTH_ERRORS[apiError.id]) {
        return AUTH_ERRORS[apiError.id];
      }
    }
  }
  return fallback;
}
