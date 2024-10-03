// 'use client';
// import { createContext, useContext } from 'react';
// import {
//   guestAxiosInstance,
//   adminAxiosInstance,
//   userAxiosInstance,
// } from '@/utils/client/AxiosInstance';
// import { AxiosContextInterface } from '@/models/types/Axios';

// const AxiosContext = createContext<AxiosContextInterface | null>(null);

// export const useAxios = () => {
//   const context = useContext(AxiosContext);

//   if (!context) {
//     throw new Error('useAxios must be used within an AxiosProvider');
//   }

//   return context;
// };

// const AxiosProvider = ({ children }: { children: React.ReactNode }) => {
//   return (
//     <AxiosContext.Provider
//       value={{
//         guest_request: guestAxiosInstance,
//         admin_request: adminAxiosInstance,
//         user_request: userAxiosInstance,
//       }}
//     >
//       {children}
//     </AxiosContext.Provider>
//   );
// };

// export default AxiosProvider;
