import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import React from 'react';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import DeleteIcon from '@mui/icons-material/Delete';
import ListItem from '@mui/material/ListItem';
import CourseBadge from './CourseBadge';

export interface CourseListProps {
  courseCode?: string | null;
  withinOneHourCourse?: string | null;
  editMode: boolean;
  onSelect?: (course: string) => void;
}

function CourseList({
  courseCode,
  withinOneHourCourse,
  editMode,
  onSelect,
}: CourseListProps) {
  // TODO: student course Get from backend
  const courses = ['COMP3278', 'COMP3230', 'COMP3297', 'CENG9001'];

  return (
    <List>
      <Divider />
      {courses.map((c) => (
        <ListItem
          key={c}
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
            selected={courseCode === c}
            onClick={() => {
              onSelect?.(c);
            }}
          >
            <ListItemText primary={c} />
            {c === withinOneHourCourse && <CourseBadge text="<1h" />}
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
}

CourseList.defaultProps = {
  courseCode: null,
  withinOneHourCourse: null,
  onSelect: () => {},
};

export default CourseList;
