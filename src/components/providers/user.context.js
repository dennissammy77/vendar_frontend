import { createContext, useContext, useEffect, useState } from 'react';
import useFetchUserData from '../hooks/useFetchUserData.hook';

export const UserContext = createContext(null);

export function UserProvider({children}) {
    const [user, set_user] = useState('');
    const [user_handler, set_user_handler] = useState('');

    useEffect(()=>{
        FetchUser()
    },[user_handler]);
    const FetchUser=async()=>{
        const data = await useFetchUserData();
        set_user(data)
    }
  
    return (
      <UserContext.Provider value={{ user,set_user_handler }}>
        {children}
      </UserContext.Provider>
    );
}