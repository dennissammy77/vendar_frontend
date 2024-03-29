import axios from 'axios';
import RouteHandler from '../routehandler.js';
import Cookies from 'universal-cookie';
import useFetchUserData from '@/components/hooks/useFetchUserData.hook.js';

export async function CreateNewStore (payload){
    let base_url = await RouteHandler();
	const cookies = new Cookies();
    const AuthToken = cookies.get('user_token1');
    const useremail = await useFetchUserData();
    console.log(useremail)
    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${base_url}/api/shop/create/new/${useremail}`,
        headers: { 
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${AuthToken}`
        },
        data : payload
    };
    axios.request(config).then((response) => {
        console.log(JSON.stringify(response.data));
    }).catch((error) => {
        console.log(error);
    });
}