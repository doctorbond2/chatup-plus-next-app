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
