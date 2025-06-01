export interface IRefresh {
  refresh_token: string;
  grant_type: string;
  scope: string;
}
export interface AuthorizationResponse {
  access_token: string;
  token_type: string;
  refresh_token: string;
  expires_in: number;
  scope: string;
}
export interface IAuth {
  username: string;
  password: string;
  grant_type: string;
  scope: string;
}
export interface GuestAuthResponse {
  id: string;
  url: string;
  ttl: number;
}
export interface GuestVerificationResponse {
  access_token: string;
  token_type: string;
  refresh_token: string;
  expires_in: Int32Array;
  scope: string;
}
export interface GuestAuthorizationError {
  code: string;
  message: string;
  date: string;
  errors: any[]; // Если есть какие-либо дополнительные ошибки
}
