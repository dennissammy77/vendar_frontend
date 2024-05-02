import Cookies from 'universal-cookie';

export default function SELECT_ACTIVE_STORE(store){
    const cookies = new Cookies();
    cookies.set('active_store', store, {path: '/'});
}

export const FETCH_ACTIVE_STORE_ID = ()=>{
    const cookies = new Cookies();
    const result = cookies.get('active_store')
    return result;
}