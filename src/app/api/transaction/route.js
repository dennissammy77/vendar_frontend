import { Cookies } from "react-cookie";
import RouteHandler from "../routehandler";
import axios from "axios";

export async function FETCH_STORE_TRANSACTIONS_DATA(store_id){
    let BASE_URL = await RouteHandler();
    const cookies = new Cookies();
    const AUTH_TOKEN = cookies.get('user_token1');

    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${BASE_URL}/api/transaction/store?store_id=${store_id}`,
        headers: { 
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${AUTH_TOKEN}`
        },
    };

    const response = await axios.request(config).then((response) => {
        return response;
    }).catch((error) => {
        return (error)
    });
    return response;
    
}

export async function FETCH_TRANSACTION_DATA(transaction_id){
    let BASE_URL = await RouteHandler();
    const cookies = new Cookies();
    const AUTH_TOKEN = cookies.get('user_token1');

    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${BASE_URL}/api/transaction/data?transaction_id=${transaction_id}`,
        headers: { 
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${AUTH_TOKEN}`
        },
    };

    const response = await axios.request(config).then((response) => {
        return response;
    }).catch((error) => {
        return (error)
    });
    return response;
    
}

export async function NEW_STORE_TRANSACTION(data,USER_ID, PRODUCT_ID, STORE_ID){
    let BASE_URL = await RouteHandler();
    const cookies = new Cookies();
    const AUTH_TOKEN = cookies.get('user_token1');

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${BASE_URL}/api/transaction/new?user_id=${USER_ID}&product_id=${PRODUCT_ID}&store_id=${STORE_ID}`,
        headers: { 
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${AUTH_TOKEN}`
        },
        data: data
    };

    const response = await axios.request(config).then((response) => {
        return response;
    }).catch((error) => {
        return (error)
    });
    return response;
}
export async function DELETE_STORE_TRANSACTION(USER_ID, TRANSACTION_ID){
    let BASE_URL = await RouteHandler();
    const cookies = new Cookies();
    const AUTH_TOKEN = cookies.get('user_token1');

    let config = {
        method: 'delete',
        maxBodyLength: Infinity,
        url: `${BASE_URL}/api/transaction/delete?user_id=${USER_ID}&transaction_id=${TRANSACTION_ID}`,
        headers: { 
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${AUTH_TOKEN}`
        }
    };

    const response = await axios.request(config).then((response) => {
        return response;
    }).catch((error) => {
        return (error)
    });
    return response;
}