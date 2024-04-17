import axios from 'axios';
import RouteHandler from '../routehandler.js';

export async function NEW_SUPPORT_TICKET (payload){
    let base_url = await RouteHandler();
    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${base_url}/api/support/new`,
        headers: { 
            'Content-Type': 'application/json',
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