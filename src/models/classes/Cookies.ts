import { cookies } from 'next/headers';
class COOKIES {
  constructor() {}
  private static cookie_storage: string[] = [];

  static setToken(token: string) {
    cookies().set('token', token);
  }
  static setRefreshToken(token: string) {
    cookies().set('refreshToken', token);
  }
  static getToken() {
    const token = cookies().get('token');
    return token ? token.value : null;
  }
  static getRefreshToken() {
    const refreshToken = cookies().get('refreshToken');
    return refreshToken ? refreshToken.value : null;
  }
}
export default COOKIES;
