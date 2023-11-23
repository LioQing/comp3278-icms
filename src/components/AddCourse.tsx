import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import InfiniteScroll from 'react-infinite-scroll-component';
import ButtonBase from '@mui/material/ButtonBase';
import Checkbox from '@mui/material/Checkbox';
import SearchIcon from '@mui/icons-material/Search';
import { CourseList as Course } from '../models/CourseList';
import Panel from './Panel';
import useAxios from '../hooks/useAxios';
import { CourseAvailable, getCourseAvailable } from '../models/CourseAvailable';
import { CourseEnroll, postCourseEnroll } from '../models/CourseEnroll';

const transition = 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)';

export interface AddCourseProps {
  courses: Course[];
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  opened: boolean;
  onClose: () => void;
}

function AddCourse({ courses, setCourses, opened, onClose }: AddCourseProps) {
  const theme = useTheme();
  const [page, setPage] = React.useState(1);
  const [availables, setAvailables] = React.useState<CourseAvailable[]>([]);
  const [nextAvailables, setNextAvailables] = React.useState<CourseAvailable[]>(
    [],
  );
  const [query, setQuery] = React.useState<string>('');
  const pageSize = 10;

  const courseAvailableClient = useAxios<CourseAvailable[]>();
  const nextCourseAvailableClient = useAxios<CourseAvailable[]>();
  const courseEnrollClient = useAxios<CourseEnroll>();

  React.useEffect(() => {
    if (!courseEnrollClient.response) return;

    if (courseEnrollClient.response.status === 200) {
      setCourses(courseEnrollClient.response.data.courses);
    }
  }, [courseEnrollClient.response]);

  const fetchCourses = () => {
    setAvailables([...availables, ...nextAvailables]);
    nextCourseAvailableClient.sendRequest(
      getCourseAvailable({
        page: page + 1,
        page_size: pageSize,
        query,
      }),
    );
  };

  const handleEnroll = (course: Course, checked: boolean) => {
    const newCourses = checked
      ? [...courses, course]
      : courses.filter((c) => c.id !== course.id);

    courseEnrollClient.sendRequest(
      postCourseEnroll({
        ids: newCourses.map((c) => c.id),
      }),
    );
  };

  React.useEffect(() => {
    if (!courseAvailableClient.response) return;

    if (courseAvailableClient.response.status === 200) {
      setAvailables([...availables, ...courseAvailableClient.response.data]);
    }
  }, [courseAvailableClient.response]);

  React.useEffect(() => {
    if (!nextCourseAvailableClient.response) return;

    if (nextCourseAvailableClient.response.status === 200) {
      setNextAvailables(nextCourseAvailableClient.response.data);
    }
  }, [nextCourseAvailableClient.response]);

  const fetchMoreCourses = () => {
    setPage(page + 1);
    fetchCourses();
  };

  React.useEffect(() => {
    courseAvailableClient.sendRequest(
      getCourseAvailable({
        page,
        page_size: pageSize,
        query,
      }),
    );
    nextCourseAvailableClient.sendRequest(
      getCourseAvailable({
        page: page + 1,
        page_size: pageSize,
        query,
      }),
    );
    setPage(page + 1);
  }, []);

  const handleSearch = () => {
    setAvailables([]);
    courseAvailableClient.sendRequest(
      getCourseAvailable({
        page: 1,
        page_size: pageSize,
        query,
      }),
    );
    nextCourseAvailableClient.sendRequest(
      getCourseAvailable({
        page: 2,
        page_size: pageSize,
        query,
      }),
    );
    setPage(2);
  };

  const keyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Panel
      title="Enroll Course"
      trailing={
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      }
      sx={{
        opacity: opened ? 1 : 0,
        transition,
      }}
    >
      <TextField
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
        }}
        sx={{ width: '100%', mb: 2 }}
        onKeyDown={keyPress}
        InputProps={{
          endAdornment: (
            <IconButton onClick={handleSearch}>
              <SearchIcon />
            </IconButton>
          ),
        }}
        placeholder='Search course by name, code, or year. Example: "Algoritma"'
      />
      <Box
        height={500}
        border="1px solid"
        overflow="hidden"
        borderRadius="8px"
        borderColor={`${theme.palette.primary.main}88`}
      >
        <Box id="courseBox" height={500} overflow="auto">
          <InfiniteScroll
            dataLength={availables.length}
            next={fetchMoreCourses}
            loader={<Typography variant="h4">Loading...</Typography>}
            hasMore={nextAvailables.length > 0}
            scrollableTarget="courseBox"
          >
            {availables
              .map((course, i) => ({ course, i }))
              .map(({ course, i }) => (
                <Box
                  key={course.id}
                  width="100%"
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  borderTop={i === 0 ? undefined : '1px solid'}
                  borderRight="1px solid"
                  borderColor={`${theme.palette.primary.main}88`}
                  gap={2}
                >
                  <ButtonBase
                    sx={{
                      width: '100%',
                      height: '100%',
                      p: 1,
                      textAlign: 'left',
                    }}
                  >
                    <Checkbox
                      checked={
                        courses.findIndex((c) => c.id === course.id) !== -1
                      }
                      onChange={(e) => handleEnroll(course, e.target.checked)}
                      disableRipple
                    />
                    <Typography variant="body1" width="100%">
                      {course.code} {course.name} ({course.year} -{' '}
                      {course.year + 1})
                    </Typography>
                  </ButtonBase>
                </Box>
              ))}
          </InfiniteScroll>
        </Box>
      </Box>
    </Panel>
  );
}

export default AddCourse;
