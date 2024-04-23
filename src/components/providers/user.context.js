import { createContext, useContext, useEffect, useState } from 'react';
import useFetchUserData from '../hooks/useFetchUserData.hook';
import useFetchToken from '../hooks/useFetchToken.hook';
import { FETCH_USER_DATA } from '@/app/api/auth/route';
import { useQuery } from '@tanstack/react-query';


export const UserContext = createContext(null);

export function UserProvider({children}) {
    const [user, set_user] = useState('');
    const [user_handler, set_user_handler] = useState('');

    // useEffect(()=>{
    //     FetchUser()
    // },[user_handler]);
  
    // const FetchUser=async()=>{
    //     const data = await useFetchUserData();
    //     set_user(data)
    // }
  
    const RETREIVED_TOKEN = useFetchToken();

    const USER_ID = RETREIVED_TOKEN?.sub;

    const {data, isLoading} = useQuery({
        queryKey: ['USER_DATA', {USER_ID,set_user_handler}],
        queryFn: async () => {
          try{
            const result = await FETCH_USER_DATA(USER_ID);
            console.log(result)
            set_user(result)
          }catch(error){
            console.log(error)
          }
        },
        retryDelay: 2000
    });
    //console.log(data)

    return (
      <UserContext.Provider value={{ user,set_user_handler }}>
        {children}
      </UserContext.Provider>
    );
}