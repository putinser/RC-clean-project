export type UserRole = {
  id: number;
  display_name: string;
  name: string;
};

export type UserAuthData = {
  id: number;
  name: string;
  avatar: string | null;
  email: string;
  role: UserRole;
  email_notifications: boolean;
  autoprolong: boolean;
};

export type User = UserAuthData;

export type MeResponse = {
  success: boolean;
  data: UserAuthData;
  error: null | {id: string};
};
