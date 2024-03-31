import axios from 'axios';
import RouteHandler from '../routehandler.js';
import Cookies from 'universal-cookie';
import useFetchUserData from '@/components/hooks/useFetchUserData.hook.js';
import useFetchToken from '@/components/hooks/useFetchToken.hook.js';

export async function CreateNewStore (payload){
    let base_url = await RouteHandler();
	const cookies = new Cookies();
    const AuthToken = cookies.get('user_token1');
    const user_decoded_token = useFetchToken();
    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${base_url}/api/shop/create/new/${user_decoded_token?.sub}`,
        headers: { 
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${AuthToken}`
        },
        data : payload
    };
    const response = await axios.request(config).then((response) => {
        return response;
    }).catch((error) => {
        return (error)
    });
    return response;
}