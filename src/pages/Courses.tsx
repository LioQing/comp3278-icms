import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Panel from '../components/Panel';
import CourseList from '../components/CourseList';
import CoursePanel from '../components/CoursePanel';
import usePrevious from '../hooks/usePrevious';
import useQuery from '../hooks/useQuery';
import useAxios from '../hooks/useAxios';
import {
  CourseCurrent,
  CourseCurrentInfo,
  getCourseCurrent,
} from '../models/CourseCurrent';
import { CourseList as Course, getCourseList } from '../models/CourseList';
import { CourseDetails, getCourseDetails } from '../models/CourseDetails';
import { SessionDetails, getSessionDetails } from '../models/SessionDetails';
import AddCourse from '../components/AddCourse';
import Chatbot from '../components/Chatbot';

const transition = 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)';

function Courses() {
  const history = React.useMemo(() => window.history, []);
  const query = useQuery();
  const [courseId, setCourseId] = React.useState<
    number | 'add' | 'chat' | null
  >(() => {
    const id = query.get('course');
    if (id === null) return null;
    return parseInt(id, 10);
  });
  const [course, setCourse] = React.useState<
    CourseDetails | 'add' | 'chat' | null
  >(null);
  const [courses, setCourses] = React.useState<Course[]>([]);
  const [coursesError, setCoursesError] = React.useState<string | null>(null);
  const [current, setCurrent] = React.useState<CourseCurrentInfo[]>([]);
  const [withinOneHour, setWithinOneHour] = React.useState<CourseCurrentInfo[]>(
    [],
  );
  const [sessionId, setSessionId] = React.useState<number | null>(() => {
    const id = query.get('session');
    if (id === null) return null;
    return parseInt(id, 10);
  });
  const [session, setSession] = React.useState<SessionDetails | null>(null);
  const [opened, setOpened] = React.useState<boolean>(courseId !== null);
  const prevCourse = usePrevious(course);
  const openedCourseRef = React.useRef<HTMLDivElement>(null);
  const courseListRef = React.useRef<HTMLDivElement>(null);

  const courseListClient = useAxios<Course[]>();

  React.useEffect(() => {
    courseListClient.sendRequest(getCourseList());
  }, []);

  React.useEffect(() => {
    if (!courseListClient.response) return;

    if (courseListClient.response.status === 200) {
      setCourses(courseListClient.response.data);
    }
  }, [courseListClient.response]);

  React.useEffect(() => {
    if (!courseListClient.error) return;

    const data: any = courseListClient.error.response?.data;
    if (data.detail) {
      setCoursesError(data.detail);
    } else {
      setCoursesError(courseListClient.error.message);
    }
  }, [courseListClient.error]);

  const courseCurrentClient = useAxios<CourseCurrent>();

  React.useEffect(() => {
    courseCurrentClient.sendRequest(getCourseCurrent());
  }, []);

  React.useEffect(() => {
    if (!courseCurrentClient.response) return;

    if (courseCurrentClient.response.status === 200) {
      setCurrent(courseCurrentClient.response.data.current);
      setWithinOneHour(courseCurrentClient.response.data.within_one_hour);
    }
  }, [courseCurrentClient.response]);

  const courseDetailsClient = useAxios<CourseDetails>();

  React.useEffect(() => {
    if (!courseId || courseId === 'add' || courseId === 'chat') return;

    courseDetailsClient.sendRequest(getCourseDetails(courseId));
  }, [courseId]);

  React.useEffect(() => {
    if (!courseDetailsClient.response) return;

    if (courseDetailsClient.response.status === 200) {
      setCourse(courseDetailsClient.response.data);
    }
  }, [courseDetailsClient.response]);

  const sessionDetailsClient = useAxios<SessionDetails>();

  React.useEffect(() => {
    if (!sessionId) return;

    sessionDetailsClient.sendRequest(getSessionDetails(sessionId));
  }, [sessionId]);

  React.useEffect(() => {
    if (!sessionDetailsClient.response) return;

    if (sessionDetailsClient.response.status === 200) {
      setSession(sessionDetailsClient.response.data);
    }
  }, [sessionDetailsClient.response]);

  const handleSetSessionId = (id: number | null) => {
    if (id === sessionId) {
      return;
    }
    setSessionId(id);
    setSession(null);
  };

  const handleSetOpenedCourse = (id?: number | 'add' | 'chat') => {
    if (id === 'add') {
      setCourse('add');
      setCourseId('add');
      setSessionId(null);
      setOpened(true);
      return;
    }
    if (id === 'chat') {
      setCourse('chat');
      setCourseId('chat');
      setSessionId(null);
      setOpened(true);
      return;
    }

    if (id === courseId) {
      return;
    }

    setCourseId((id as number | undefined) ?? null);
    setSessionId(null);
    setOpened(id !== undefined);
  };

  // Handle closing course detail
  React.useEffect(() => {
    if (!opened && course) {
      setTimeout(() => {
        if (opened) return;
        setCourse(null);
      }, 250);
    }
  }, [opened, course]);

  // Handle url for state changes
  React.useEffect(() => {
    if (prevCourse === undefined || courseId === 'add' || courseId === 'chat') {
      return;
    }

    history.pushState(
      null,
      '',
      `/courses/?course=${courseId ?? ''}&session=${sessionId ?? ''}`,
    );
  }, [courseId, sessionId, history]);

  const courseList = (
    <Box
      display="flex"
      position="absolute"
      width="100%"
      flexDirection="row"
      alignItems="flex-start"
      justifyContent="center"
      gap={2}
      zIndex={3}
      sx={{
        pointerEvents: 'none',
      }}
      ref={courseListRef}
    >
      <Box
        flex={opened ? 0 : 3.5}
        sx={{
          transition,
        }}
      />
      <Box flex={3}>
        <Panel
          title="Courses"
          sx={{
            p: 2,
            pb: 4,
            transition,
            pointerEvents: 'auto',
          }}
          titleSx={{ ml: 1 }}
        >
          <CourseList
            selected={
              course !== null && course !== 'add' && course !== 'chat'
                ? course.id
                : null
            }
            current={current}
            withinOneHour={withinOneHour}
            editMode={false}
            onSelect={(c) => handleSetOpenedCourse(c)}
            error={coursesError}
            courses={courses}
          />
        </Panel>
      </Box>
      <Box
        flex={opened ? 7 : 3.5}
        sx={{
          transition,
        }}
      />
    </Box>
  );

  const openedCourse = (
    <Box
      display="flex"
      position="absolute"
      width="100%"
      flexDirection="row"
      alignItems="flex-start"
      justifyContent="center"
      gap={2}
      zIndex={2}
      ref={openedCourseRef}
    >
      <Box flex={0} />
      <Box flex={3} />
      <Box flex={7} minWidth={0}>
        {(course === 'add' || course === null) && (
          <AddCourse
            courses={courses}
            setCourses={setCourses}
            opened={opened}
            onClose={() => handleSetOpenedCourse()}
          />
        )}
        {(course === 'chat' || course === null) && (
          <Chatbot opened={opened} onClose={() => handleSetOpenedCourse()} />
        )}
        {((course !== 'add' && course !== 'chat') || course === null) && (
          <CoursePanel
            course={course}
            withinOneHour={false}
            session={(sessionId ?? 0) === 0 ? null : session}
            setSession={handleSetSessionId}
            opened={opened}
            onClose={() => handleSetOpenedCourse()}
          />
        )}
      </Box>
    </Box>
  );

  return (
    <Container>
      <CssBaseline />
      <Box position="relative">
        {courseList}
        {openedCourse}
      </Box>
    </Container>
  );
}

export default Courses;
