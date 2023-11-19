import { AxiosRequest } from '../hooks/useAxios';

export interface Account {
  username: string;
  id: number;
  name: string;
  email: string;
  has_face: boolean;
}

export const getAccount = (): AxiosRequest<Account[]> => ({
  url: '/api/account/',
  method: 'get',
});
