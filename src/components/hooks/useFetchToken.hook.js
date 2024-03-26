import Cookies from 'universal-cookie';
import { jwtDecode } from "jwt-decode";

export default function useFetchToken(){
    const cookies = new Cookies();
    const token = cookies.get('user_token1');
    if (token){
        const decoded_token = jwtDecode(token);
        return decoded_token;
    }else{
        return null;
    }
}