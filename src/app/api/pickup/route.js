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

    export async function FETCH_STORE_PICKUP_DATA (USER_ID,STORE_ID,SEARCH_QUERY,STOCK_FILTER,FROM_DATE,TO_DATE){
        let BASE_URL = await RouteHandler();
        const cookies = new Cookies();
        const AUTH_TOKEN = cookies.get('user_token1');
      
        let CONFIG = {
          method: 'get',
          maxBodyLength: Infinity,
          url: `${BASE_URL}/api/pickup/store/all?store_id=${STORE_ID}&user_id=${USER_ID}&stock_filter=${STOCK_FILTER}&search_query=${SEARCH_QUERY}&from_date=${FROM_DATE}&to_date=${TO_DATE}`,
          headers: { 
            'Authorization': `Bearer ${AUTH_TOKEN}`
          }
        };
      
        const result = await axios.request(CONFIG).then((response) => {
            return response;
          }).catch((error) => {
            return(error)
          });
        return result;
      }
    
    export async function FETCH_PICKUP_DATA (PICKUP_ID){
        let BASE_URL = await RouteHandler();
        const cookies = new Cookies();
        const AUTH_TOKEN = cookies.get('user_token1');
      
        let CONFIG = {
          method: 'get',
          maxBodyLength: Infinity,
          url: `${BASE_URL}/api/pickup/data?pickup_id=${PICKUP_ID}`,
          headers: { 
            'Authorization': `Bearer ${AUTH_TOKEN}`
          }
        };
      
        const result = await axios.request(CONFIG).then((response) => {
            return response;
          }).catch((error) => {
            return(error)
          });
        return result;
      }
    export async function UPDATE_STORE_PICKUP (data,STORE_ID,USER_ID,PICKUP_ID,FLAG){
        let BASE_URL = await RouteHandler();
        const cookies = new Cookies();
        const AUTH_TOKEN = cookies.get('user_token1');
        
        let config = {
            method: 'put',
            maxBodyLength: Infinity,
            url: `${BASE_URL}/api/pickup/update?user_id=${USER_ID}&pickup_id=${PICKUP_ID}&store_id=${STORE_ID}&flag=${FLAG}`,
            headers: { 
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${AUTH_TOKEN}`
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
    export async function DELETE_STORE_PICKUP (USER_ID,PICKUP_ID){
        let BASE_URL = await RouteHandler();
        const cookies = new Cookies();
        const AUTH_TOKEN = cookies.get('user_token1');
        
        let config = {
          method: 'delete',
          maxBodyLength: Infinity,
          url: `${BASE_URL}/api/pickup/delete?user_id=${USER_ID}&pickup_id=${PICKUP_ID}`,
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