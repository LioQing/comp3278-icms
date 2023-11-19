import { AxiosRequest } from '../hooks/useAxios';

export interface SetupFaceRequest {
  images: string[];
}

export const postSetupFace = (data: SetupFaceRequest): AxiosRequest => {
  const formData = new FormData();
  data.images.forEach((image) => {
    formData.append('images', image);
  });

  return {
    url: '/api/setup-face/',
    method: 'post',
    data: formData,
  };
};
