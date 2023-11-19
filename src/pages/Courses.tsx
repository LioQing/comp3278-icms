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
import { CourseDetails, getCourseDetails } from '../models/CourseDetails';
import { SessionDetails, getSessionDetails } from '../models/SessionDetails';

const transition = 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)';

function Courses() {
  const history = React.useMemo(() => window.history, []);
  const query = useQuery();
  const [courseId, setCourseId] = React.useState<number | null>(() => {
    const id = query.get('course');
    if (id === null) return null;
    return parseInt(id, 10);
  });
  const [course, setCourse] = React.useState<CourseDetails | null>(null);
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
    if (!courseId) return;

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

  const handleSetOpenedCourse = (id?: number) => {
    if (id === courseId) {
      return;
    }
    setCourseId(id ?? null);
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
    if (prevCourse === undefined) {
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
        >
          <CourseList
            selected={course?.id}
            current={current}
            withinOneHour={withinOneHour}
            editMode={false}
            onSelect={(c) => handleSetOpenedCourse(c)}
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
      <Box flex={7}>
        <CoursePanel
          course={course}
          withinOneHour={false}
          session={(sessionId ?? 0) === 0 ? null : session}
          setSession={handleSetSessionId}
          opened={opened}
          onClose={() => handleSetOpenedCourse()}
        />
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
