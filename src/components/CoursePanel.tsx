import React from 'react';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Box from '@mui/material/Box';
import Course from '../models/Course';
import Panel from './Panel';
import Session, {
  getSession,
  getStartTime,
  getEndTime,
  formatDatetime,
} from '../models/Session';
import CourseBadge from './CourseBadge';

const transition = 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)';

export interface CoursePanelProps {
  course: Course | null;
  withinOneHour: boolean;
  session: Session | null;
  setSession: React.Dispatch<Session | null>;
  sessionPanelHeight: number;
  sessionPanelRef: React.RefObject<HTMLDivElement>;
  opened: boolean;
  onClose: () => void;
}

function CoursePanel({
  course,
  withinOneHour,
  session,
  setSession,
  sessionPanelHeight,
  sessionPanelRef,
  opened,
  onClose,
}: CoursePanelProps) {
  const handleSessionSelection = (event: SelectChangeEvent) => {
    const value = event.target.value as string;
    setSession(getSession(course, value));
  };

  const sessionPanel = (
    <Box ref={sessionPanelRef}>
      <Typography>{`Course: ${session?.name}`}</Typography>
      <Typography>{session ? getStartTime(session) : ''}</Typography>
      <Typography>{session ? getEndTime(session) : ''}</Typography>
      {/* eslint-disable-next-line react/jsx-no-comment-textnodes */}
      <Typography>// TODO: Add more session detail</Typography>
    </Box>
  );

  return (
    <Panel
      title={course?.code}
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
      {withinOneHour && (
        <Box display="flex" flexDirection="row" mb={1}>
          <CourseBadge text="<1h" />
        </Box>
      )}
      {course && <Typography>{course.description}</Typography>}
      <FormControl sx={{ my: 2, minWidth: 200 }}>
        <InputLabel id="select-session-label">Session</InputLabel>
        <Select
          labelId="select-session-label"
          id="select-session"
          value={session ? getStartTime(session) : ''}
          label="Session"
          onChange={handleSessionSelection}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {course?.sessions.map((c) => (
            <MenuItem key={formatDatetime(c)} value={formatDatetime(c)}>
              {formatDatetime(c)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Box height={sessionPanelHeight} sx={{ overflow: 'hidden', transition }}>
        {session && sessionPanel}
      </Box>
    </Panel>
  );
}

export default CoursePanel;
