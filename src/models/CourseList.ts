import moment from 'moment';
import { AxiosRequest } from '../hooks/useAxios';

export interface CourseList {
  id: number;
  code: string;
  name: string;
}

export const getCourseList = (): AxiosRequest<CourseList[]> => ({
  url: '/api/course/list/',
  method: 'get',
  params: {
    time: moment().format('YYYY-MM-DDTHH:mm:ss'),
  },
});
