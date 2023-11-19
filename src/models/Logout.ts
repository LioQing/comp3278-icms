import { AxiosRequest } from '../hooks/useAxios';

// eslint-disable-next-line import/prefer-default-export
export const postLogout = (): AxiosRequest => ({
  url: '/api/logout/',
  method: 'post',
});
