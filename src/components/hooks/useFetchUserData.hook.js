import { FETCH_USER_DATA, FetchUserDetails } from "@/app/api/auth/route";
import useFetchToken from "./useFetchToken.hook";

const useFetchUserData = async() =>{
    const RETREIVED_TOKEN = useFetchToken();
    
    if (RETREIVED_TOKEN === null || !RETREIVED_TOKEN){
        return null;
    }
    const USER_ID = RETREIVED_TOKEN?.sub;
    try {
        const result = await FETCH_USER_DATA(USER_ID);
        return result;
    } catch (error) {
        return null;
    }
};

export default useFetchUserData;