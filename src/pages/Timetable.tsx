import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ButtonBase from '@mui/material/ButtonBase';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import moment from 'moment';
import useTheme from '@mui/material/styles/useTheme';
import { useNavigate } from 'react-router-dom';
import Panel from '../components/Panel';
import {
  Timetable as TimetableSession,
  getTimetable,
} from '../models/Timetable';
import useAxios from '../hooks/useAxios';
import useLocalStorage from '../hooks/useLocalStorage';

interface SessionProps {
  session: TimetableSession;
  handleCourseClick: (session: TimetableSession) => () => void;
}

function Session({ session, handleCourseClick }: SessionProps) {
  const theme = useTheme();
  const [timetableSettings] = useLocalStorage('timetableSettings', {
    'Show Time': false,
    'Show Name': false,
    'Show Classroom': false,
    'Show Session Type': false,
  });

  const start = new Date(session.start_time);
  const end = new Date(session.end_time);

  const startHour = start.getHours();
  const startMinute = start.getMinutes();
  const endHour = end.getHours();
  const endMinute = end.getMinutes();
  const duration = (endHour - startHour) * 60 + endMinute - startMinute;
  const offsetY = startHour * 60 + startMinute;
  const offsetX = start.getDay();
  const height = (duration / 1440) * 100;
  const top = (offsetY / 1440) * 100;
  const left = (offsetX / 7) * 100;

  // Build text
  let text = `${session.course_code}`;
  if (timetableSettings['Show Time']) {
    text += `\n${moment(start).format('HH:mm')} - ${moment(end).format(
      'HH:mm',
    )}`;
  }
  if (timetableSettings['Show Name']) {
    text += `\n${session.course_name}`;
  }
  if (timetableSettings['Show Classroom']) {
    text += `\n${session.classroom}`;
  }
  if (timetableSettings['Show Session Type']) {
    text += `\n${session.session_type}`;
  }

  return (
    <Paper
      key={session.session_id}
      elevation={2}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        position: 'absolute',
        top: `${top}%`,
        left: `${left}%`,
        height: `${height}%`,
        width: 'calc(100% / 7)',
        backgroundColor: `${theme.palette.primary.main}88`,
        borderRadius: '8px',
        textAlign: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
        ':hover': {
          filter: 'brightness(110%)',
        },
      }}
    >
      <ButtonBase
        focusRipple
        onClick={handleCourseClick(session)}
        sx={{
          width: '100%',
          height: '100%',
          px: 1,
          py: 0.2,
        }}
      >
        <Typography
          variant="caption"
          lineHeight={1.2}
          whiteSpace="pre-line"
          sx={{
            maxHeight: '100%',
          }}
        >
          {text}
        </Typography>
      </ButtonBase>
    </Paper>
  );
}

function Timetable() {
  const navigate = useNavigate();
  const [date, setDate] = React.useState(new Date());
  const [error, setError] = React.useState<string | null>(null);
  const [errorOpened, setErrorOpened] = React.useState(false);
  const [sessions, setSessions] = React.useState<TimetableSession[]>([]);

  const timetableClient = useAxios<TimetableSession[]>();

  React.useEffect(() => {
    if (!timetableClient.response) return;

    setSessions(timetableClient.response.data);
  }, [timetableClient.response]);

  React.useEffect(() => {
    if (!timetableClient.error) return;

    setError(timetableClient.error.message);
    setErrorOpened(true);
  }, [timetableClient.error]);

  React.useEffect(() => {
    timetableClient.sendRequest(
      getTimetable({
        date: moment(date).format('YYYY-MM-DD'),
      }),
    );
  }, [date]);

  const handleCourseClick = (session: TimetableSession) => () => {
    navigate(
      `/courses/?course=${session.course_id}&session=${session.session_id}`,
    );
  };

  return (
    <Container>
      <CssBaseline />
      <Panel
        title="Timetable"
        trailing={
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              onClick={() => {
                const d = new Date(date);
                d.setDate(d.getDate() - 7);
                setDate(d);
              }}
            >
              Previous Week
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                const d = new Date(date);
                d.setDate(d.getDate() + 7);
                setDate(d);
              }}
            >
              Next Week
            </Button>
          </Stack>
        }
        sx={{ width: '100%' }}
      >
        <Stack direction="column" spacing={2} mb={1} mt={2}>
          <Box display="flex" flexDirection="row">
            <Box width="4rem" />
            {[...Array(7)].map((_, i) => {
              const day = new Date(date);
              day.setDate(date.getDate() - date.getDay() + i);
              return (
                <Box
                  key={moment(day).format('YYYY-MM-DD')}
                  flex={1}
                  textAlign="center"
                >
                  <Typography variant="body2">
                    {moment(day).format('YYYY-MM-DD')}
                  </Typography>
                  <Typography variant="h6">
                    {day.toLocaleString('en-GB', {
                      weekday: 'long',
                    })}
                  </Typography>
                </Box>
              );
            })}
          </Box>
          <Box display="flex" flexDirection="row">
            <Box position="relative" width="4rem">
              <Box
                display="flex"
                position="absolute"
                flexDirection="column"
                justifyContent="space-between"
                top="-0.5rem"
                right={8}
                height="calc(100% + 1rem)"
                width="100%"
                textAlign="right"
              >
                {[...Array(6)]
                  .map((_, i) =>
                    new Date(0, 0, 0, i * 4).toLocaleTimeString('en-GB', {
                      hour: 'numeric',
                      minute: 'numeric',
                      hour12: false,
                    }),
                  )
                  .map((time) => (
                    <Typography key={time} variant="body2">
                      {time}
                    </Typography>
                  ))}
                <Typography variant="body2">24:00</Typography>
              </Box>
            </Box>
            <Box
              height="800px"
              flexGrow={1}
              sx={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '8px',
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Grid container height="100%" width="100%">
                {[...Array(7 * 24)]
                  .map((_, i) => i)
                  .map((i) => (
                    <Grid
                      key={i}
                      item
                      minWidth="calc(100% / 7)"
                      sx={{
                        borderLeft: i % 7 === 0 ? 'none' : '1px solid',
                        borderTop: i < 7 ? 'none' : '1px solid',
                        borderColor: 'divider',
                      }}
                    />
                  ))}
              </Grid>
              {sessions.map((session) => (
                <Session
                  key={session.session_id}
                  session={session}
                  handleCourseClick={handleCourseClick}
                />
              ))}
            </Box>
          </Box>
        </Stack>
      </Panel>
      <Snackbar
        open={errorOpened}
        autoHideDuration={6000}
        onClose={() => setErrorOpened(false)}
      >
        <Alert onClose={() => setErrorOpened(false)} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default Timetable;
