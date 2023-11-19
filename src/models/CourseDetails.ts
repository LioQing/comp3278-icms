import { AxiosRequest } from '../hooks/useAxios';

export interface CourseDetailsHyperlink {
  id: number;
  name: string;
  description: string;
  order: number;
  created_at: string;
  last_edit: string;
  url: string;
}

export interface CourseDetailsFile {
  id: number;
  name: string;
  description: string;
  order: number;
  created_at: string;
  last_edit: string;
  file: string;
}

export interface CourseDetailsSession {
  id: number;
  start_time: string;
  end_time: string;
  type: string;
}

export interface CourseDetails {
  id: number;
  code: string;
  year: number;
  name: string;
  description: string;
  hyperlinks: CourseDetailsHyperlink[];
  files: CourseDetailsFile[];
  sessions: CourseDetailsSession[];
}

export const getCourseDetails = (
  id: number,
): AxiosRequest<CourseDetails[]> => ({
  url: `/api/course/details/${id}/`,
  method: 'get',
});
