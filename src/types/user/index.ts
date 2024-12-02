export type UserResource = {
  id: number;
  is_admin: boolean;
  name: string;
  lastname: string;
  full_name: string;
  email: string;
};

export type RegisterUserPayload = {
  name: string;
  lastname: string;
  email: string;
  password: string;
  password_confirmation: string;
};

export type LoginUserPayload = {
  email: string;
  password: string;
};
