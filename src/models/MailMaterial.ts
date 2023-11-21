import { AxiosRequest } from '../hooks/useAxios';

export interface MailMaterialRequest {
  owner: string;
  owner_id: number;
  material: string;
  material_id: number;
}

export const postMailMaterial = (
  data: MailMaterialRequest,
): AxiosRequest<MailMaterialRequest> => ({
  url: '/api/mail-material/',
  method: 'post',
  data,
});
