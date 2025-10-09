import axios from 'axios';
import RouteHandler from '../routehandler.js';
import Cookies from 'universal-cookie';
import useFetchToken from '@/components/hooks/useFetchToken.hook.js';

export async function CreateNewStore (payload){
    let base_url = await RouteHandler();
	const cookies = new Cookies();
    const AuthToken = cookies.get('user_token1');
    const user_decoded_token = useFetchToken();
    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${base_url}/api/store/new?user_id=${user_decoded_token?.sub}`,
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

export async function FETCH_STORE_DATA(store_id,USER_ID){
    let base_url = await RouteHandler();
    const cookies = new Cookies();
    const AuthToken = cookies.get('user_token1');

    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${base_url}/api/store/data?user_id=${USER_ID}&store_id=${store_id}`,
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

export async function FETCH_STORES_BY_OWNER(USER_ID){
    let base_url = await RouteHandler();
    const cookies = new Cookies();
    const AuthToken = cookies.get('user_token1');

    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${base_url}/api/store/owner/all?user_id=${USER_ID}`,
        headers: { 
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${AuthToken}`
        },
    };

    const result = await axios.request(config).then((response) => {
        return response;
    }).catch((error) => {
        return (error)
    });
    return result;
}

export async function FETCH_STORES_BY_VENDOR(USER_ID){
    let base_url = await RouteHandler();
    const cookies = new Cookies();
    const AuthToken = cookies.get('user_token1');

    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${base_url}/api/store/vendor/all?user_id=${USER_ID}`,
        headers: { 
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${AuthToken}`
        },
    };

    const result = await axios.request(config).then((response) => {
        return response;
    }).catch((error) => {
        return (error)
    });
    return result;
}

export async function UPDATE_STORE_DATA(data,store_id,user_id,flag){
    let base_url = await RouteHandler();
    const cookies = new Cookies();
    const AuthToken = cookies.get('user_token1');

    let config = {
        method: 'put',
        maxBodyLength: Infinity,
        url: `${base_url}/api/store/update?store_id=${store_id}&user_id=${user_id}&flag=${flag}`,
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

export async function DELETE_STORE_DATA(USER_ID, STORE_ID, flag){

    let base_url = await RouteHandler();
    const cookies = new Cookies();
    const AuthToken = cookies.get('user_token1');

    let config = {
        method: 'delete',
        maxBodyLength: Infinity,
        url: `${base_url}/api/store/delete?store_id=${STORE_ID}&user_id=${USER_ID}&flag=${flag}`,
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${AuthToken}`
        }
      };
      
    const response = await axios.request(config).then((response) => {
        return response;
    }).catch((error) => {
        return (error)
    });
    return response;
}

export async function REQUEST_TO_JOIN_STORE({ user_id, store_id, store_name }){
    let base_url = await RouteHandler();
    const cookies = new Cookies();
    const AuthToken = cookies.get('user_token1');

    const params = new URLSearchParams();
    if (user_id) params.append('user_id', user_id);
    if (store_id) params.append('store_id', store_id);
    if (store_name) params.append('store_name', store_name);

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${base_url}/api/store/vendor/request?${params.toString()}`,
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${AuthToken}`
        }
    };
    const response = await axios.request(config).then((response) => {
        return response;
    }).catch((error) => {
        return (error)
    });
    return response;
}