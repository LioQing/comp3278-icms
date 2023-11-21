import { AxiosRequest } from '../hooks/useAxios';

export interface RegisterRequest {
  name: string;
  id: string;
  email: string;
  username: string;
  password: string;
}

export interface Register {
  auth_token: string;
}

export const postRegister = (
  data: RegisterRequest,
): AxiosRequest<RegisterRequest> => ({
  url: '/api/register/',
  method: 'post',
  data,
});
