import moment from 'moment';
import { AxiosRequest } from '../hooks/useAxios';

export interface CourseCurrentInfo {
  session: number;
  course: number;
}

export interface CourseCurrent {
  current: CourseCurrentInfo[];
  within_one_hour: CourseCurrentInfo[];
}

export const getCourseCurrent = (): AxiosRequest<CourseCurrent[]> => ({
  url: '/api/course/current/',
  method: 'get',
  params: {
    time: moment().format('YYYY-MM-DDTHH:mm:ss'),
  },
});
