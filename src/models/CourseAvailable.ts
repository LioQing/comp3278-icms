import { AxiosRequest } from '../hooks/useAxios';

export interface CourseAvailableRequest {
  page: number;
  page_size: number;
  query: string;
}

export interface CourseAvailable {
  id: number;
  code: string;
  name: string;
  year: number;
}

export const getCourseAvailable = (
  params: CourseAvailableRequest,
): AxiosRequest<CourseAvailable[]> => ({
  url: '/api/course/available/',
  method: 'get',
  params,
});
