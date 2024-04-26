import Cookies from 'universal-cookie';

export default function SELECT_ACTIVE_STORE(store){
    const cookies = new Cookies();
    cookies.set('active_store', store, {path: '/'});
}