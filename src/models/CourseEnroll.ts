import { AxiosRequest } from '../hooks/useAxios';

export interface CourseEnrollRequest {
  ids: number[];
}

export interface CourseEnrollCourse {
  id: number;
  code: string;
  name: string;
}

export interface CourseEnroll {
  courses: CourseEnrollCourse[];
}

export const postCourseEnroll = (
  data: CourseEnrollRequest,
): AxiosRequest<CourseEnrollRequest> => ({
  url: '/api/course/enroll/',
  method: 'post',
  data,
});
