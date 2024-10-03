import type { Metadata } from 'next';
import './globals.css';
import UserContextProvider from '@/context/UserContext';
import AxiosProvider from '@/context/AxiosContext';
export const metadata: Metadata = {
  title: 'Chatup-plus',
  description: 'Next version of chatup application',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AxiosProvider>
          <UserContextProvider>
            <header></header>

            {children}

            <footer></footer>
          </UserContextProvider>
        </AxiosProvider>
      </body>
    </html>
  );
}
