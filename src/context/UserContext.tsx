'use client';
import { useRouter } from 'next/navigation';
import { useContext, createContext } from 'react';
import { UserContextInterface } from '@/models/types/User';
import { defaultUserContextInterface } from '@/models/types/defaultValues/User';
import { UserFrontend } from '@/models/types/User';
import { useState } from 'react';
import COOKIES from '@/models/classes/Cookies';
import {
  RegisterInformation,
  LoginInformation,
  UpdateProfileInformation,
} from '@/models/types/Auth';

const userContext = createContext<UserContextInterface>(
  defaultUserContextInterface
);

export const useUserContext = () => useContext(userContext);

const UserContextProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<UserFrontend | null>(null);
  async function login(formData: LoginInformation): Promise<void> {
    try {
      const response = await guest_request.post('/auth/login', formData);
      const { data } = response;
      const { user, token, refreshToken } = data;
      console.log(response.data);
      setUser(user);
      COOKIES.setToken(token);
      COOKIES.setRefreshToken(refreshToken);
      router.push('/');
    } catch (err) {
      console.log('Error logging in:', err);
      setUser(null);
      await logout();
      router.push('/login');
    }
  }
  async function register(formData: RegisterInformation): Promise<void> {
    try {
      const response = await guest_request.post('/auth/register', formData);
      console.log(response.data);
      router.push('/login');
    } catch (err) {
      console.log('Error registering:', err);
    }
  }
  async function update(formData: UpdateProfileInformation): Promise<void> {
    console.log('Update: ', formData);
  }
  async function logout(): Promise<void> {
    COOKIES.clearRefreshToken();
    COOKIES.clearToken();
  }
  const providerValue = { login, register, update, logout, user, setUser };
  return (
    <userContext.Provider value={providerValue}>
      {children}
    </userContext.Provider>
  );
};
export default UserContextProvider;
