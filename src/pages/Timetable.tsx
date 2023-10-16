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
import moment from 'moment';
import useTheme from '@mui/material/styles/useTheme';
import { useNavigate } from 'react-router-dom';
import Panel from '../components/Panel';
import Session, { getStartTime } from '../models/Session';

function Timetable() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [sundayDate, setSundayDate] = React.useState(
    (() => {
      const d = new Date();
      d.setDate(d.getDate() - d.getDay());
      return d;
    })(),
  );

  // TODO: Get student sessions from backend using sundayDate
  const sessions = React.useMemo<Session[]>(() => {
    const e = new Date();
    e.setDate(e.getDate() - e.getDay());
    if (sundayDate.toDateString() !== e.toDateString()) {
      return [];
    }

    const a = new Date(sundayDate);
    a.setHours(12, 30);
    const b = new Date(sundayDate);
    b.setHours(16, 20);

    const c = new Date(sundayDate);
    c.setDate(c.getDate() + 4);
    c.setHours(8, 30);
    const d = new Date(sundayDate);
    d.setDate(d.getDate() + 4);
    d.setHours(19, 20);

    return [
      { start: a, end: b, name: 'COMP3278' },
      { start: c, end: d, name: '//TODO: Add courses' },
    ];
  }, [sundayDate]);

  const handleCourseClick = (c: Session) => () => {
    navigate(`/courses/?course=${c.name}&session=${getStartTime(c)}`);
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
                const d = new Date(sundayDate);
                d.setDate(d.getDate() - 7);
                setSundayDate(d);
              }}
            >
              Previous Week
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                const d = new Date(sundayDate);
                d.setDate(d.getDate() + 7);
                setSundayDate(d);
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
              const day = new Date(sundayDate);
              day.setDate(sundayDate.getDate() + i);
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
              height="600px"
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
              {sessions.map(({ start, end, name }: Session) => {
                const startHour = start.getHours();
                const startMinute = start.getMinutes();
                const endHour = end.getHours();
                const endMinute = end.getMinutes();
                const duration =
                  (endHour - startHour) * 60 + endMinute - startMinute;
                const offsetY = startHour * 60 + startMinute;
                const offsetX = start.getDay();
                const height = (duration / 1440) * 100;
                const top = (offsetY / 1440) * 100;
                const left = (offsetX / 7) * 100;
                return (
                  <Paper
                    key={name}
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
                      onClick={handleCourseClick({ start, end, name })}
                      sx={{
                        width: '100%',
                        height: '100%',
                        p: 1,
                      }}
                    >
                      {name}
                    </ButtonBase>
                  </Paper>
                );
              })}
            </Box>
          </Box>
        </Stack>
      </Panel>
    </Container>
  );
}

export default Timetable;
