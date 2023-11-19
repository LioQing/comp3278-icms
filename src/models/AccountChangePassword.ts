import { AxiosRequest } from '../hooks/useAxios';

export interface AccountChangePasswordRequest {
  old_password: string;
  new_password: string;
}

export const postAccountChangePassword = (
  data: AccountChangePasswordRequest,
): AxiosRequest<{}, AccountChangePasswordRequest> => ({
  url: '/api/account/change-password/',
  method: 'post',
  data,
});
