import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import React from 'react';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import DeleteIcon from '@mui/icons-material/Delete';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import CourseBadge from './CourseBadge';
import { CourseList as Course, getCourseList } from '../models/CourseList';
import useAxios from '../hooks/useAxios';
import { CourseCurrentInfo } from '../models/CourseCurrent';

export interface CourseListProps {
  selected?: number | null;
  current: CourseCurrentInfo[];
  withinOneHour: CourseCurrentInfo[];
  editMode: boolean;
  onSelect?: (id: number) => void;
}

function CourseList({
  selected,
  current,
  withinOneHour,
  editMode,
  onSelect,
}: CourseListProps) {
  const [courses, setCourses] = React.useState<Course[]>([]);
  const [error, setError] = React.useState<string | null>(null);

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
      setError(data.detail);
    } else {
      setError(courseListClient.error.message);
    }
  }, [courseListClient.error]);

  if (error) {
    return (
      <Typography variant="body1" sx={{ color: 'error' }}>
        {error}
      </Typography>
    );
  }

  return (
    <List>
      <Divider />
      {courses.map((c) => (
        <ListItem
          key={c.id}
          divider
          disablePadding
          secondaryAction={
            editMode && (
              <IconButton edge="end" aria-label="delete">
                <DeleteIcon />
              </IconButton>
            )
          }
        >
          <ListItemButton
            selected={selected === c.id}
            onClick={() => {
              onSelect?.(c.id);
            }}
          >
            <ListItemText primary={c.code} />
            {current.map((c) => c.course).includes(c.id) ? (
              <CourseBadge text="current" />
            ) : withinOneHour.map((c) => c.course).includes(c.id) ? (
              <CourseBadge text="<1h" />
            ) : null}
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
}

CourseList.defaultProps = {
  selected: null,
  onSelect: () => {},
};

export default CourseList;
