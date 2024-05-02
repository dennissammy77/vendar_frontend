import RouteHandler from "../routehandler";
import Cookies from 'universal-cookie';
import axios from 'axios';

    export async function NEW_STORE_PICKUP (data,STORE_ID){
        let BASE_URL = await RouteHandler();
        const cookies = new Cookies();
        const AUTH_TOKEN = cookies.get('user_token1');
        
        let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${BASE_URL}/api/pickup/new?store_id=${STORE_ID}`,
        headers: { 
            'Content-Type': 'application/json',
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