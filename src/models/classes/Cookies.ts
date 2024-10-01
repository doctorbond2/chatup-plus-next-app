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
    return cookies().get('token');
  }
  static getRefreshToken() {
    return cookies().get('refreshToken');
  }
}
export default COOKIES;
