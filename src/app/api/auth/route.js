import axios from 'axios';
import Cookies from 'universal-cookie';
import RouteHandler from '../routehandler.js';

export default async function SignUpApi (payload){
    let base_url = await RouteHandler();
	const cookies = new Cookies();
	const result = await axios.post(`${base_url}/api/auth/signup`,payload);
    if (result?.data?.error){
        throw new Error(result.data.message)
    }else{
        cookies.set('user_token1', result?.data.token, {path: '/'});
        return result;
    }
}
export async function SignInApi (payload){
    let base_url = await RouteHandler();
	const cookies = new Cookies();
	const result = await axios.post(`${base_url}/api/auth/signin`,payload);
    if (result?.data?.error){
        throw new Error(result.data.message)
    }else{
        cookies.set('user_token1', result?.data.token, {path: '/'});
        return result;
    }
}

export async function FETCH_STAKEHOLDERS_DATA (STORE_ID,ACCOUNT_TYPE){
  let BASE_URL = await RouteHandler();
  const cookies = new Cookies();
  const AUTH_TOKEN = cookies.get('user_token1');

  let CONFIG = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${BASE_URL}/api/user/stakeholders?store_id=${STORE_ID}&account_type=${ACCOUNT_TYPE}`,
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

export async function NEW_STORE_STAKEHOLDER_ACCOUNT(data,USER_ID,STORE_ID){
  let BASE_URL = await RouteHandler();
  const cookies = new Cookies();
  const AUTH_TOKEN = cookies.get('user_token1');

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${BASE_URL}/api/user/stakeholder/new?user_id=${USER_ID}&&store_id=${STORE_ID}`,
    headers: { 
      'Content-Type': 'application/json', 
      'Authorization': `Bearer ${AUTH_TOKEN}`
    },
    data : data
  };
  
  const result = await axios.request(config).then((response) => {
      return response;
  }).catch((error) => {
      return(error)
  });
  return result;

}

export async function UPDATE_STORE_STAKEHOLDER_ACCOUNT(data,USER_ID,STORE_ID,FLAG){
  let BASE_URL = await RouteHandler();
  const cookies = new Cookies();
  const AUTH_TOKEN = cookies.get('user_token1');

  let CONFIG = {
    method: 'put',
    maxBodyLength: Infinity,
    url: `${BASE_URL}/api/user/stakeholder/update?user_id=${USER_ID}&store_id=${STORE_ID}&flag=${FLAG}`,
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${AUTH_TOKEN}`
    },
    data : data
  };

  const result = await axios.request(CONFIG).then((response) => {
    return response;
  }).catch((error) => {
      return(error)
  });
  return result;
}

export async function DELETE_STORE_STAKEHOLDER_ACCOUNT(USER_ID,ACCOUNT_ID,ACCOUNT_TYPE,FLAG){
  let BASE_URL = await RouteHandler();
  const cookies = new Cookies();
  const AUTH_TOKEN = cookies.get('user_token1');

  let CONFIG = {
    method: 'delete',
    maxBodyLength: Infinity,
    url: `${BASE_URL}/api/user/stakeholder/delete?user_id=${USER_ID}&account_id=${ACCOUNT_ID}&account_type=${ACCOUNT_TYPE}&flag=${FLAG}`,
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

export async function CreateShopAdmin(data){
    let base_url = await RouteHandler();
    const cookies = new Cookies();
    const AuthToken = cookies.get('user_token1');
    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${base_url}/api/auth/create/shop_admin`,
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${AuthToken}`
        },
        data : data
      };
      
    const result = await axios.request(config).then((response) => {
        return response;
    }).catch((error) => {
        return(error)
    });
    return result;
}

export async function FETCH_USER_DATA (USER_ID){
  let BASE_URL = await RouteHandler();
  const cookies = new Cookies();
  const AUTH_TOKEN = cookies.get('user_token1');

  let CONFIG = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${BASE_URL}/api/user/data?user_id=${USER_ID}`,
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

export async function UPDATE_USER_ACCOUNT(data,USER_ID){
  let BASE_URL = await RouteHandler();
  const cookies = new Cookies();
  const AUTH_TOKEN = cookies.get('user_token1');

  let CONFIG = {
    method: 'put',
    maxBodyLength: Infinity,
    url: `${BASE_URL}/api/user/update?user_id=${USER_ID}`,
    headers: { 
      'Authorization': `Bearer ${AUTH_TOKEN}`
    },
    data: data
  };

  const result = await axios.request(CONFIG).then((response) => {
      return response;
    }).catch((error) => {
      return(error)
    });
  return result;
}

export async function DELETE_USER_ACCOUNT(USER_ID,ACCOUNT_TYPE,FLAG){
  let BASE_URL = await RouteHandler();
  const cookies = new Cookies();
  const AUTH_TOKEN = cookies.get('user_token1');

  let CONFIG = {
    method: 'delete',
    maxBodyLength: Infinity,
    url: `${BASE_URL}/api/user/delete?user_id=${USER_ID}&account_type=${ACCOUNT_TYPE}&flag=${FLAG}`,
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

export async function FetchUserDetails (uid){
    let base_url = await RouteHandler();
	const cookies = new Cookies();
    const AuthToken = cookies.get('user_token1');
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${base_url}/api/user/fetch?uid=${uid}`,
        headers: { 
          'Authorization': `Bearer ${AuthToken}`
        }
      };
      
    const result = await axios.request(config).then((response) => {
        return response;
      }).catch((error) => {
        return(error)
      });
    return result;
}

export async function FetchUsersShop(store_id){
    let base_url = await RouteHandler();
	  const cookies = new Cookies();
    const AuthToken = cookies.get('user_token1');
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${base_url}/api/user/fetch/store/all?store_id=${store_id}`,
      headers: {
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${AuthToken}`
      }
    };
      
    const result = await axios.request(config).then((response) => {
        return response;
      }).catch((error) => {
        return(error)
      });
    return result;
}