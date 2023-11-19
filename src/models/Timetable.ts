import { AxiosRequest } from '../hooks/useAxios';

export interface TimetableRequest {
  date: string;
}

export interface Timetable {
  session_id: number;
  start_time: string;
  end_time: string;
  session_type: string;
  classroom: string;
  course_id: number;
  course_code: string;
  course_name: string;
}

export const getTimetable = (
  params: TimetableRequest,
): AxiosRequest<Timetable[], {}, TimetableRequest> => ({
  url: '/api/timetable/',
  method: 'get',
  params,
});
