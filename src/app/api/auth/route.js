import axios from 'axios';
import Cookies from 'universal-cookie';
import RouteHandler from '../routehandler.js';

export default async function SignUpApi (payload){
    let base_url = await RouteHandler();
	const cookies = new Cookies();
	const result = await axios.post(`${base_url}/api/auth/signup`,payload);
    if (result?.data?.error){
        throw new Error(result.data.message)
    }else{
        cookies.set('user_token1', result?.data.token, {path: '/'});
        return result;
    }
}
export async function SignInApi (payload){
    let base_url = await RouteHandler();
	const cookies = new Cookies();
	const result = await axios.post(`${base_url}/api/auth/signin`,payload);
    if (result?.data?.error){
        throw new Error(result.data.message)
    }else{
        cookies.set('user_token1', result?.data.token, {path: '/'});
        return result;
    }
}