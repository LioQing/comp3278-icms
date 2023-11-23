import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import React from 'react';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import DeleteIcon from '@mui/icons-material/Delete';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import CourseBadge from './CourseBadge';
import { CourseList as Course } from '../models/CourseList';
import { CourseCurrentInfo } from '../models/CourseCurrent';

export interface CourseListProps {
  selected?: number | null;
  current: CourseCurrentInfo[];
  withinOneHour: CourseCurrentInfo[];
  editMode: boolean;
  onSelect?: (id: number | 'add') => void;
  error: string | null;
  courses: Course[];
}

function CourseList({
  selected,
  current,
  withinOneHour,
  editMode,
  onSelect,
  error,
  courses,
}: CourseListProps) {
  if (error) {
    return (
      <Typography variant="body1" sx={{ color: 'error' }}>
        {error}
      </Typography>
    );
  }

  return (
    <>
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
      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={() => {
          onSelect?.('add');
        }}
        sx={{ mt: 1, ml: 1, width: 'calc(100% - 16px)' }}
      >
        Enroll
      </Button>
    </>
  );
}

CourseList.defaultProps = {
  selected: null,
  onSelect: () => {},
};

export default CourseList;
