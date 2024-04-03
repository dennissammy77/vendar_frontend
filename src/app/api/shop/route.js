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
        url: `${base_url}/api/store/create/new/${user_decoded_token?.sub}`,
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

export async function FetchStore(store_id){
    let base_url = await RouteHandler();
    const cookies = new Cookies();
    const AuthToken = cookies.get('user_token1');

    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${base_url}/api/store/data?store_id=${store_id}`,
        headers: { 
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${AuthToken}`
        },
    };

    const response = await axios.request(config).then((response) => {
        return response;
    }).catch((error) => {
        return (error)
    });
    return response;
}

export async function UpdateStore(data,store_id,uid,flag){
    let base_url = await RouteHandler();
    const cookies = new Cookies();
    const AuthToken = cookies.get('user_token1');

    let config = {
        method: 'put',
        maxBodyLength: Infinity,
        url: `${base_url}/api/store/update?store_id=${store_id}&&uid=${uid}&&flag=${flag}`,
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${AuthToken}`
        },
        data : data
      };
      
    const response = await axios.request(config).then((response) => {
        return response;
    }).catch((error) => {
        return (error)
    });
    return response;
}