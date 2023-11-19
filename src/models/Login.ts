import { AxiosRequest } from '../hooks/useAxios';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface Login {
  auth_token: string;
}

export const postLogin = (data: LoginRequest): AxiosRequest<LoginRequest> => ({
  url: '/api/login/',
  method: 'post',
  data,
});
