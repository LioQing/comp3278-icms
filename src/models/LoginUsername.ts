import { AxiosRequest } from '../hooks/useAxios';

export interface LoginUsernameRequest {
  username: string;
}

export interface LoginUsername {
  username: string;
}

export const postLoginUsername = (
  data: LoginUsernameRequest,
): AxiosRequest<LoginUsername, LoginUsernameRequest> => ({
  url: '/api/login-username/',
  method: 'post',
  data,
});
