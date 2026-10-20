export interface LoginData {
  username: string;
  password: string;
}

export type LoginDataField = "username" | "password";

export interface LoginDataPayload {
  field: LoginDataField;
  value: string;
}

export interface LoginInitialState {
  isPasswordVisible: boolean;
  data: LoginData;
}
