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