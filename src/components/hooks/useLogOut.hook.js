import Cookies from 'universal-cookie';

export default function useLogOut(){
    const cookies = new Cookies();
    cookies.remove('user_token1', { path: '/' });
}