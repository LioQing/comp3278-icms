import { AxiosRequest } from '../hooks/useAxios';

export interface LastLogin {
  last_login: string;
}

export const getLastLogin = (): AxiosRequest<LastLogin> => ({
  url: '/api/last-login/',
  method: 'get',
});
