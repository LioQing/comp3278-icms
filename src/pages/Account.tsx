import React, { useLayoutEffect } from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import InfiniteScroll from 'react-infinite-scroll-component';
import Button from '@mui/material/Button';
import moment from 'moment';
import Typography from '@mui/material/Typography';
import useTheme from '@mui/material/styles/useTheme';
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';
import Panel from '../components/Panel';
import User from '../models/User';
import Log from '../models/Log';

const userLogs = [
  ['2021-10-01T12:00:00', 'Login'],
  ['2021-10-01T11:00:00', 'Logout'],
  ['2021-10-01T10:30:00', 'Updated name'],
  ['2021-10-01T10:00:00', 'Updated email'],
  ['2021-10-01T09:00:00', 'Added course COMP3278'],
  ['2021-10-01T08:00:00', 'Login'],
  ['2021-10-02T11:00:00', 'Logout'],
  ['2021-10-02T12:00:00', 'Login'],
  ['2021-10-02T11:00:00', 'Logout'],
  ['2021-10-02T10:30:00', 'Updated name'],
  ['2021-10-02T10:00:00', 'Updated email'],
  ['2021-10-02T09:00:00', 'Added course COMP3278'],
  ['2021-10-02T08:00:00', 'Login'],
  ['2021-10-03T11:00:00', 'Logout'],
  ['2021-10-03T12:00:00', 'Login'],
  ['2021-10-03T11:00:00', 'Logout'],
  ['2021-10-03T10:30:00', 'Updated name'],
  ['2021-10-03T10:00:00', 'Updated email'],
  ['2021-10-03T09:00:00', 'Added course COMP3278'],
  ['2021-10-03T08:00:00', 'Login'],
  ['2021-10-04T12:30:00', 'Logout'],
  ['2021-10-04T12:00:00', 'Login'],
  ['2021-10-04T11:00:00', 'Logout'],
  ['2021-10-01T12:00:00', 'Login'],
  ['2021-10-01T11:00:00', 'Logout'],
  ['2021-10-01T10:30:00', 'Updated name'],
  ['2021-10-01T10:00:00', 'Updated email'],
  ['2021-10-01T09:00:00', 'Added course COMP3278'],
  ['2021-10-01T08:00:00', 'Login'],
  ['2021-10-02T11:00:00', 'Logout'],
  ['2021-10-02T12:00:00', 'Login'],
  ['2021-10-02T11:00:00', 'Logout'],
  ['2021-10-02T10:30:00', 'Updated name'],
  ['2021-10-02T10:00:00', 'Updated email'],
  ['2021-10-02T09:00:00', 'Added course COMP3278'],
  ['2021-10-02T08:00:00', 'Login'],
  ['2021-10-03T11:00:00', 'Logout'],
  ['2021-10-03T12:00:00', 'Login'],
  ['2021-10-03T11:00:00', 'Logout'],
  ['2021-10-03T10:30:00', 'Updated name'],
  ['2021-10-03T10:00:00', 'Updated email'],
  ['2021-10-03T09:00:00', 'Added course COMP3278'],
  ['2021-10-03T08:00:00', 'Login'],
  ['2021-10-04T12:30:00', 'Logout'],
  ['2021-10-04T12:00:00', 'Login'],
  ['2021-10-04T11:00:00', 'Logout'],
];

const transition = 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)';

function fetchLogs(page: number): Log[] {
  // TODO: Get log from backend
  const pageSize = 10;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return userLogs
    .slice(start, end)
    .map(([time, log]) => new Log(new Date(time), log));
}

function Account() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [page, setPage] = React.useState(1);
  const [logs, setLogs] = React.useState(fetchLogs(page));
  const [nextLogs, setNextLogs] = React.useState(fetchLogs(page + 1));
  const [changingPassword, setChangingPasswordInner] = React.useState(false);
  const [changePasswordOpened, setChangePasswordOpened] = React.useState(false);
  const [changePasswordHeight, setChangePasswordHeight] =
    React.useState<number>(0);
  const changePasswordRef = React.useRef<HTMLDivElement>(null);

  // TODO: Get user data from backend
  const [user, setUser] = React.useState<User>({
    username: 'test_account',
    name: 'Test Account',
    email: 'test@test.com',
    hasFaceLogin: false,
  });

  const fetchMoreLogs = () => {
    setPage(page + 1);
    setLogs([...logs, ...nextLogs]);
    setNextLogs(fetchLogs(page + 1));
  };

  const setChangingPassword = (opened: boolean) => {
    if (opened) {
      setChangePasswordOpened(true);
      setChangingPasswordInner(true);
    } else {
      setChangePasswordOpened(false);
      setTimeout(() => {
        setChangingPasswordInner(false);
      }, 250);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    // TODO: Add password change
    console.log({
      username: data.get('oldPassword'),
      password: data.get('newPassword'),
      remember: data.get('confirmPassword'),
    });
    setChangingPassword(false);
  };

  const handleDisableFaceLogin = () => {
    // TODO: Disable face login in backend
    setUser({ ...user, hasFaceLogin: false });
  };

  const handleEnableFaceLogin = () => {
    navigate('/face-setup/?redirect=/account/');
  };

  // Handle password panel
  useLayoutEffect(() => {
    if (changePasswordOpened && changePasswordRef.current) {
      const panel = changePasswordRef.current;
      setChangePasswordHeight(panel.offsetHeight);
    } else {
      setChangePasswordHeight(0);
    }
  }, [changePasswordOpened, changePasswordRef]);

  const changePasswordPanel = (
    <Box
      ref={changePasswordRef}
      py={1}
      height="fit-content"
      width="calc(100% - 16px)"
    >
      <Panel title="Changing Password">
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="oldPassword"
            label="Old Password"
            name="oldPassword"
            autoComplete="oldPassword"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="newPassword"
            label="New Password"
            name="newPassword"
            autoComplete="newPassword"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="confirmPassword"
            label="Confirm Password"
            name="confirmPassword"
            autoComplete="confirmPassword"
          />
          <Box display="flex" flexDirection="row" gap={1} mt={2}>
            <Button
              variant="outlined"
              onClick={() => {
                setChangingPassword(false);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              Submit
            </Button>
          </Box>
        </Box>
      </Panel>
    </Box>
  );

  return (
    <Container>
      <CssBaseline />
      <Panel title={user.name}>
        <Box display="flex" flexDirection="row" alignItems="center">
          <Box display="flex" flexDirection="column">
            <Box display="flex" flexDirection="row" alignItems="center">
              <Box mr={2}>
                <img
                  src={`https://avatars.dicebear.com/api/avataaars/${user.username}.svg`}
                  alt="Avatar"
                  width="100"
                  height="100"
                />
              </Box>
              <Box display="flex" flexDirection="column">
                <Box display="flex" flexDirection="row" alignItems="center">
                  <Box mr={1}>Username:</Box>
                  <Box>{user.username}</Box>
                </Box>
                <Box display="flex" flexDirection="row" alignItems="center">
                  <Box mr={1}>Email:</Box>
                  <Box>{user.email}</Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box display="flex" flexDirection="column" my={2} justifyItems="left">
          <Typography variant="h6" gutterBottom>
            Security
          </Typography>
          <Box display="flex" flexDirection="column" gap={1}>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap={1}
            >
              <Box
                display="flex"
                flexDirection="row"
                gap={1}
                width="100%"
                justifyContent="flex-start"
              >
                <Button
                  variant="outlined"
                  onClick={() => setChangingPassword(!changingPassword)}
                  sx={{
                    backgroundColor: changingPassword
                      ? `${theme.palette.primary.main}1D`
                      : undefined,
                  }}
                >
                  Change Password
                </Button>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  maxHeight: changePasswordHeight,
                  width: 'calc(100% + 16px)',
                  overflow: 'hidden',
                  transition,
                }}
              >
                {changingPassword && changePasswordPanel}
              </Box>
            </Box>
            <Box display="flex" flexDirection="row" gap={1}>
              {user.hasFaceLogin ? (
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleDisableFaceLogin}
                >
                  Disable Face Login
                </Button>
              ) : (
                <Button variant="outlined" onClick={handleEnableFaceLogin}>
                  Enable Face Login
                </Button>
              )}
            </Box>
          </Box>
        </Box>
        <Box display="flex" flexDirection="column" my={2}>
          <Typography variant="h6" gutterBottom>
            Activity Log
          </Typography>
          <Box
            height={400}
            border="1px solid"
            overflow="hidden"
            borderRadius="8px"
            borderColor={`${theme.palette.primary.main}88`}
          >
            <Box id="logBox" height={400} overflow="auto">
              <InfiniteScroll
                dataLength={logs.length}
                next={fetchMoreLogs}
                loader={<h4>Loading...</h4>}
                hasMore={nextLogs.length > 0}
                scrollableTarget="logBox"
              >
                {logs
                  .map((log, i) => ({ log, i }))
                  .map(({ log, i }) => (
                    <Box
                      key={i}
                      width="100%"
                      display="flex"
                      flexDirection="row"
                      alignItems="center"
                      borderTop={i === 0 ? undefined : '1px solid'}
                      borderRight="1px solid"
                      borderColor={`${theme.palette.primary.main}88`}
                      p={1}
                      gap={2}
                    >
                      <Box>
                        {moment(log.timestamp).format('YYYY-MM-DD HH:mm:ss')}
                      </Box>
                      <Box>{log.message}</Box>
                    </Box>
                  ))}
              </InfiniteScroll>
            </Box>
          </Box>
        </Box>
      </Panel>
    </Container>
  );
}

export default Account;
