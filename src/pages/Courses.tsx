import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Panel from '../components/Panel';
import CourseList from '../components/CourseList';
import CoursePanel from '../components/CoursePanel';
import Course from '../models/Course';
import Session, { getSession, getStartTime } from '../models/Session';
import usePrevious from '../hooks/usePrevious';
import useQuery from '../hooks/useQuery';

// TODO: Delete this
const exampleCourse = {
  code: 'COMP3278',
  description:
    '//TODO: Course details & Material. \nLorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris massa enim, dapibus a eros feugiat, lobortis volutpat tellus. Vestibulum commodo nulla sit amet congue ultrices. Phasellus volutpat finibus tortor, a interdum elit ultrices vel. Ut feugiat placerat tristique. Aenean ultrices, velit non tempus pellentesque, felis sem pretium urna, vel vulputate arcu leo eget lorem. In volutpat metus et eros tempor iaculis. Sed ut tempus nisi. Morbi est felis, dapibus quis neque non, porttitor molestie risus. Sed interdum massa vel quam ornare luctus. Praesent fringilla a purus id consectetur. Sed vitae egestas nulla. Praesent at nunc at mi convallis commodo. Proin ornare vehicula elit a fringilla. Donec ac felis sit amet eros sollicitudin vestibulum sit amet in mauris. Maecenas vulputate eu sapien ut semper.\n Nam sagittis faucibus efficitur. Vivamus interdum vehicula gravida. Sed vulputate arcu feugiat, sodales neque at, dictum metus. Maecenas aliquet elit augue, sit amet ornare justo aliquam in. Fusce magna lectus, sollicitudin non massa in, vestibulum consequat leo. Nulla vehicula enim efficitur massa lacinia, non faucibus lorem porta. In in volutpat ante, sit amet viverra arcu. Aenean et enim ligula. Fusce consequat sodales pharetra. Proin porta ac metus at pharetra. Sed posuere vestibulum laoreet. Mauris tristique sapien et diam lacinia blandit. Vestibulum ipsum velit, hendrerit id ligula sit amet, mattis tempor tortor.\nPraesent quis aliquet libero, sagittis pulvinar magna. Nam semper commodo arcu, ac elementum ex semper ut. Suspendisse vel faucibus nibh. Donec ut eros vitae odio tincidunt hendrerit. Proin leo purus, vehicula sed lectus et, faucibus lacinia leo. Vestibulum mollis vehicula malesuada. Proin lobortis velit arcu.',
  sessions: (() => {
    const d = new Date();
    d.setDate(d.getDate() - d.getDay());
    d.setHours(12, 30);

    const d1 = new Date();
    d1.setDate(d1.getDate() - d1.getDay() + 2);
    d1.setHours(8, 30);
    return [d, d1];
  })(),
} as Course;

const transition = 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)';

function getCourse(code: string | null): Course | null {
  if (
    code === null ||
    ['COMP3278', 'COMP3230', 'COMP3297', 'CENG9001'].indexOf(code) === -1
  ) {
    return null;
  }

  // TODO: Get course details from backend
  if (code === exampleCourse.code) {
    return exampleCourse;
  }

  return { code, description: exampleCourse.description, sessions: [] };
}

function Courses() {
  const history = React.useMemo(() => window.history, []);
  const query = useQuery();
  const initialCourse = getCourse(query.get('course'));
  const initialSession = getSession(initialCourse, query.get('session') ?? '');
  // TODO: Get student course details from backend
  const [course, setCourse] = React.useState<Course | null>(initialCourse);
  const withinOneHourCourse = getSession(
    exampleCourse,
    exampleCourse.sessions[0],
  );
  const [sessionDetail, setSession] = React.useState<Session | null>(
    initialSession,
  );
  const [opened, setOpened] = React.useState<boolean>(initialCourse !== null);
  const prevCourse = usePrevious(course);
  const openedCourseRef = React.useRef<HTMLDivElement>(null);
  const courseListRef = React.useRef<HTMLDivElement>(null);

  const setOpenedCourse = (c: string) => {
    if (c === course?.code) {
      return;
    }
    setCourse(getCourse(c));
    setSession(null);
    setOpened(true);
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
      `/courses/?course=${course?.code ?? ''}&session=${
        sessionDetail ? getStartTime(sessionDetail) : ''
      }`,
    );
  }, [course, sessionDetail, history]);

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
            courseCode={course?.code}
            withinOneHourCourse={withinOneHourCourse?.name}
            editMode={false}
            onSelect={(c) => setOpenedCourse(c)}
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
          withinOneHour={course?.code === withinOneHourCourse?.name}
          session={sessionDetail}
          setSession={setSession}
          opened={opened}
          onClose={() => setOpened(false)}
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
