import { Cookies } from "react-cookie";
import RouteHandler from "../routehandler";
import axios from "axios";

export async function FETCH_STORE_TRANSACTIONS_DATA(USER_ID,STORE_ID,SEARCH_QUERY,STATUS_FILTER,FROM_DATE,TO_DATE,PAGE){
    let BASE_URL = await RouteHandler();
    const cookies = new Cookies();
    const AUTH_TOKEN = cookies.get('user_token1');

    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${BASE_URL}/api/transaction/store?store_id=${STORE_ID}&user_id=${USER_ID}&status_filter=${STATUS_FILTER}&search_query=${SEARCH_QUERY}&from_date=${FROM_DATE}&to_date=${TO_DATE}&page=${PAGE}`,
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
export async function FETCH_ALL_STORE_TRANSACTION_DATA_FOR_EXPORT(USER_ID,STORE_ID){
    let BASE_URL = await RouteHandler();
    const cookies = new Cookies();
    const AUTH_TOKEN = cookies.get('user_token1');

    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${BASE_URL}/api/transaction/store/all/export?store_id=${STORE_ID}&user_id=${USER_ID}`,
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
export async function FETCH_ALL_STORE_TRANSACTION_DATA_FOR_PRODUCT_ANALYTICS(USER_ID,STORE_ID,PRODUCT_ID,WEEK,TAG){
    let BASE_URL = await RouteHandler();
    const cookies = new Cookies();
    const AUTH_TOKEN = cookies.get('user_token1');

    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${BASE_URL}/api/transaction/product/all/analytics?store_id=${STORE_ID}&user_id=${USER_ID}&product_id=${PRODUCT_ID}&week=${WEEK}&tag=${TAG}`,
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

export async function FETCH_VENDOR_TRANSACTIONS_DATA(USER_ID,STORE_ID,WEEK){
    let BASE_URL = await RouteHandler();
    const cookies = new Cookies();
    const AUTH_TOKEN = cookies.get('user_token1');

    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${BASE_URL}/api/transaction/vendor/all?user_id=${USER_ID}&store_id=${STORE_ID}&week=${WEEK}`,
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

export async function UPDATE_STORE_TRANSACTION(data,USER_ID, PRODUCT_ID, TRANSACTION_ID){
    let BASE_URL = await RouteHandler();
    const cookies = new Cookies();
    const AUTH_TOKEN = cookies.get('user_token1');

    let config = {
        method: 'put',
        maxBodyLength: Infinity,
        url: `${BASE_URL}/api/transaction/update?user_id=${USER_ID}&product_id=${PRODUCT_ID}&transaction_id=${TRANSACTION_ID}`,
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