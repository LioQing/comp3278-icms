import { AxiosRequest } from '../hooks/useAxios';

export interface SessionDetailsHyperlink {
  id: number;
  name: string;
  description: string;
  order: number;
  created_at: string;
  last_edit: string;
  url: string;
}

export interface SessionDetailsFile {
  id: number;
  name: string;
  description: string;
  order: number;
  created_at: string;
  last_edit: string;
  file: string;
}

export interface SessionDetails {
  id: number;
  start_time: string;
  end_time: string;
  type: string;
  classroom: string;
  hyperlinks: SessionDetailsHyperlink[];
  files: SessionDetailsFile[];
}

export const getSessionDetails = (
  id: number,
): AxiosRequest<SessionDetails[]> => ({
  url: `/api/session/details/${id}/`,
  method: 'get',
});
