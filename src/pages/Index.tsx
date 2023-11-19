import React from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import useAxios from '../hooks/useAxios';
import { CourseCurrent, getCourseCurrent } from '../models/CourseCurrent';

function Index(): JSX.Element | null {
  const navigate = useNavigate();
  const [cookies] = useCookies();

  const courseCurrentClient = useAxios<CourseCurrent>();

  React.useEffect(() => {
    if (!courseCurrentClient.response) return;

    if (courseCurrentClient.response.status === 200) {
      const { current, within_one_hour: withinOneHour } =
        courseCurrentClient.response.data;
      if (current.length === 0 && withinOneHour.length === 0) {
        navigate('/timetable/');
      } else if (current.length > 0) {
        const courseId = current[0].course;
        const sessionId = current[0].session;
        navigate(`/courses/?course=${courseId}&session=${sessionId}`);
      } else {
        const courseId = withinOneHour[0].course;
        const sessionId = withinOneHour[0].session;
        navigate(`/courses/?course=${courseId}&session=${sessionId}`);
      }
    }
  }, [courseCurrentClient.response]);

  React.useEffect(() => {
    if (!courseCurrentClient.error) return;

    navigate('/login/');
  }, [courseCurrentClient.error]);

  React.useEffect(() => {
    if (cookies['auth-token']) {
      courseCurrentClient.sendRequest(getCourseCurrent());
    } else {
      navigate('/login/');
    }
  }, [cookies, navigate]);

  return null;
}

export default Index;
