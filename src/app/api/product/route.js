import RouteHandler from "../routehandler";
import Cookies from 'universal-cookie';
import axios from 'axios';

export async function NEW_STORE_PRODUCT (data,STORE_ID,USER_ID){
  let BASE_URL = await RouteHandler();
  const cookies = new Cookies();
  const AUTH_TOKEN = cookies.get('user_token1');
  
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${BASE_URL}/api/product/new?user_id=${USER_ID}&&store_id=${STORE_ID}`,
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
export async function MANY_NEW_STORE_PRODUCTS (data,STORE_ID,USER_ID){
  let BASE_URL = await RouteHandler();
  const cookies = new Cookies();
  const AUTH_TOKEN = cookies.get('user_token1');
  
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${BASE_URL}/api/product/many/new?user_id=${USER_ID}&store_id=${STORE_ID}`,
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

export async function UPDATE_STORE_PRODUCT (data,STORE_ID,USER_ID,PRODUCT_ID,FLAG){
  let BASE_URL = await RouteHandler();
  const cookies = new Cookies();
  const AUTH_TOKEN = cookies.get('user_token1');
  
  let config = {
    method: 'put',
    maxBodyLength: Infinity,
    url: `${BASE_URL}/api/product/update?user_id=${USER_ID}&product_id=${PRODUCT_ID}&store_id=${STORE_ID}&flag=${FLAG}`,
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
export async function DELETE_STORE_PRODUCT (USER_ID,PRODUCT_ID){
  let BASE_URL = await RouteHandler();
  const cookies = new Cookies();
  const AUTH_TOKEN = cookies.get('user_token1');
  
  let config = {
    method: 'delete',
    maxBodyLength: Infinity,
    url: `${BASE_URL}/api/product/delete?user_id=${USER_ID}&product_id=${PRODUCT_ID}`,
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

export async function FETCH_STORE_PRODUCTS_DATA (USER_ID,STORE_ID,SEARCH_QUERY,STOCK_FILTER,FROM_DATE,TO_DATE){
    let BASE_URL = await RouteHandler();
    const cookies = new Cookies();
    const AUTH_TOKEN = cookies.get('user_token1');
  
    let CONFIG = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${BASE_URL}/api/product/store/all?store_id=${STORE_ID}&user_id=${USER_ID}&stock_filter=${STOCK_FILTER}&search_query=${SEARCH_QUERY}&from_date=${FROM_DATE}&to_date=${TO_DATE}`,
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

export async function FETCH_PRODUCT_DATA (PRODUCT_ID){
    let BASE_URL = await RouteHandler();
    const cookies = new Cookies();
    const AUTH_TOKEN = cookies.get('user_token1');
  
    let CONFIG = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${BASE_URL}/api/product/data?product_id=${PRODUCT_ID}`,
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

  export async function MOVE_STORE_PRODUCT_TO_STAKEHOLDER (STORE_ID,USER_ID,ACCOUNT_ID,PRODUCT_ID){
    let BASE_URL = await RouteHandler();
    const cookies = new Cookies();
    const AUTH_TOKEN = cookies.get('user_token1');
    
    let config = {
      method: 'put',
      maxBodyLength: Infinity,
      url: `${BASE_URL}/api/product/move?user_id=${USER_ID}&product_id=${PRODUCT_ID}&store_id=${STORE_ID}&account_id=${ACCOUNT_ID}`,
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