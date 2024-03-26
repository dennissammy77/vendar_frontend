import useFetchToken from "./useFetchToken.hook";
//import FetchUser from "@/api/auth/client/user/route";

const useFetchUserData = async() =>{
    const retrived_token = useFetchToken();
    let data = null;
    if (retrived_token === null || !retrived_token){
        return null;
    }
    const email = retrived_token?.email;
    //const result = await FetchUser(email);
    //return result.data;
    return email;
};

export default useFetchUserData;