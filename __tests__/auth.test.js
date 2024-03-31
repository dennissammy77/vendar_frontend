import axios from 'axios';
import "@testing-library/jest-dom";
import SignUpApi from '@/api/auth/route';

jest.mock('axios', () => ({
    post: jest.fn(),
}));

describe('Auth Tests', () => {
    beforeEach(()=>{
        axios.post.mockClear();
    })
    describe('User should be able to create an account', () => {
        test('should set user token in cookie and return user data on succesful sign up', async() => {
            const mockResponse = { data: {token: 'token', error:null,message:'sign up successful'},statusCode: 200, statusText: 'OK'};
            axios.post.mockResolvedValueOnce(mockResponse)
            const mockPayload = {
                name:	      "John Doe4",
                username:     "johndoe",
                email:        "johndoe6@gmail.com",
                mobile:       "0712345678",
                password:     "password",
                account_type: "shop_admin"
            }
            const response = await SignUpApi(mockPayload);
            expect(axios.post).toHaveBeenCalledTimes(1);
            //expect(axios.post).toHaveBeenCalledWith(expect.stringMatching('/api/auth/signup'), mockPayload);
            expect(document.cookie).toContain('user_token1=token');
            expect(response.data.message).toEqual(mockResponse.data.message);
        })
        test('should return Email already has an existing account,', async() => {
            const mockResponse = { data: {error:true,message:'This Email already has an existing account, try signing in'},statusCode: 200, statusText: 'OK'};
            axios.post.mockResolvedValueOnce(mockResponse)
            const response = await axios.post('http://localhost:5001/api/auth/signup', {
                name:	      "John Doe",
                username:     "johndoe",
                email:        "johndoe@gmail.com",
                mobile:       "0712345678",
                password:     "password",
                account_type: "shop_admin"
            })
            expect(axios.post).toHaveBeenCalledTimes(1);
            expect(response.data.message).toEqual(mockResponse.data.message);
        })
    });
});