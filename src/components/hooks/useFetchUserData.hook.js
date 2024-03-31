import { FetchUserDetails } from "@/app/api/auth/route";
import useFetchToken from "./useFetchToken.hook";

const useFetchUserData = async() =>{
    const retrived_token = useFetchToken();
    if (retrived_token === null || !retrived_token){
        return null;
    }
    const uid = retrived_token?.sub;
    try {
        const result = await FetchUserDetails(uid);
        return result;
    } catch (error) {
        return null;
    }
};

export default useFetchUserData;