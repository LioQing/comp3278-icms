import { AxiosRequest } from '../hooks/useAxios';

export interface AccountRecordRequest {
  page: number;
  page_size: number;
}

export interface AccountRecord {
  id: number;
  time: string;
  message: string;
}

export const getAccountRecord = (
  params: AccountRecordRequest,
): AxiosRequest<AccountRecord, {}, AccountRecordRequest> => ({
  url: '/api/account/record/',
  method: 'get',
  params,
});
