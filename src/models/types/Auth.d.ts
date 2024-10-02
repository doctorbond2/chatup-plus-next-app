import { AuthRoles } from '../enums/auth';

type Token = string;
type RefreshToken = string;

export interface Auth {
  token?: Token;
  refreshToken?: RefreshToken;
}
export interface RegisterInformation {
  username: string;
  lastName: string;
  firstName: string;
  password: string;
  email: string;
}
export type AxiosUser = AuthRoles;

export interface User_JWT {
  username: string;
  email: string;
  admin?: boolean;
}
export interface LoginInformation {
  username?: string;
  email?: string;
  password: string;
}
export interface UpdateProfileInformation {
  username?: string;
  lastName?: string;
  firstName?: string;
  password?: string;
  email?: string;
}
