import { AxiosRequest } from '../hooks/useAxios';

export interface FaceLoginRequest {
  username: string;
  image: string;
}

export interface FaceLogin {
  auth_token: string;
}

export const postFaceLogin = (
  data: FaceLoginRequest,
): AxiosRequest<FaceLoginRequest> => ({
  url: '/api/face-login/',
  method: 'post',
  data,
});
