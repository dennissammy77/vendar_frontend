import { createContext, useContext, useEffect, useState } from 'react';
import useFetchToken from '../hooks/useFetchToken.hook';
import { FETCH_USER_DATA } from '@/app/api/auth/route';
import { useQuery } from '@tanstack/react-query';


export const UserContext = createContext(null);

export function UserProvider({children}) {
    const [user, set_user] = useState('');
    const [user_handler, set_user_handler] = useState('');
  
    const RETREIVED_TOKEN = useFetchToken();

    const USER_ID = RETREIVED_TOKEN?.sub || undefined;

    const {data, isLoading} = useQuery({
        queryKey: ['USER_DATA',{USER_ID}],
        queryFn: async () => {
          try{
            if(USER_ID === undefined){
              set_user(null)
            }
            const result = await FETCH_USER_DATA(USER_ID);
            set_user(result)
          }catch(error){
            throw new Error('Error while fetching user data',error)
          }
        },
        enabled: USER_ID !== undefined
    });

    return (
      <UserContext.Provider value={{ user,set_user_handler }}>
        {children}
      </UserContext.Provider>
    );
}