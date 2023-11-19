import { AxiosRequest } from '../hooks/useAxios';

// eslint-disable-next-line import/prefer-default-export
export const postDisableFace = (): AxiosRequest => ({
  url: '/api/disable-face/',
  method: 'post',
});
