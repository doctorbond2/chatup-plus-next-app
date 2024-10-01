import axios, { AxiosInstance } from 'axios';
import { AxiosUser } from '../types/Auth';
import { AuthRoles } from '../enums/auth';
import COOKIES from './Cookies';
class AxiosServiceInstance<T extends AxiosUser> {
  private IS_PROD = process.env.NODE_ENV === 'production';
  private IS_DEV = process.env.NODE_ENV === 'development';
  private BaseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000/api';
  private api: AxiosInstance;
  private headers: {
    'Content-Type': string;
    'admin-access': boolean;
    Authorization?: string;
  } = {
    'Content-Type': 'application/json',
    'admin-access': false,
  };

  constructor(role: T) {
    this.setAdminAccess(role === AuthRoles.ADMIN);
    this.api = axios.create({
      baseURL: this.BaseUrl,
      headers: this.headers,
    });
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error(error);
        return Promise.reject(error);
      }
    );
    this.api.interceptors.request.use((config) => {
      if (this.headers.Authorization) {
        config.headers.Authorization = this.headers.Authorization;
      }
      return config;
    });
  }
  setAdminAccess(isAdmin: boolean): void {
    this.headers['admin-access'] = isAdmin;
    this.api.defaults.headers['admin-access'] = isAdmin;
  }
  addTokenToHeaders(token: string): void {
    this.headers.Authorization = `Bearer ${token}`;
    this.api.defaults.headers.Authorization = `Bearer ${token}`;
  }
  checkForTokens(): void {
    const token: string | null = COOKIES.getToken();
    if (token) {
      this.addTokenToHeaders(token);
    }
  }
}
const AdminAxiosService = new AxiosServiceInstance(AuthRoles.ADMIN);
const AxiosService = new AxiosServiceInstance(AuthRoles.GUEST);
export { AxiosService, AdminAxiosService };
