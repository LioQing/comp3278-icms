import React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import InfiniteScroll from 'react-infinite-scroll-component';
import Button from '@mui/material/Button';
import moment from 'moment';
import Typography from '@mui/material/Typography';
import useTheme from '@mui/material/styles/useTheme';
import TextField from '@mui/material/TextField';
import Collapse from '@mui/material/Collapse';
import Alert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';
import Panel from '../components/Panel';
import { Account as AccountDetails, getAccount } from '../models/Account';
import useAxios from '../hooks/useAxios';
import { postAccountChangePassword } from '../models/AccountChangePassword';
import { AccountRecord, getAccountRecord } from '../models/AccountRecord';
import { postDisableFace } from '../models/DisableFace';

function Account() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [page, setPage] = React.useState(1);
  const [records, setRecords] = React.useState<AccountRecord[]>([]);
  const [nextRecords, setNextRecords] = React.useState<AccountRecord[]>([]);
  const [changingPassword, setChangingPasswordInner] = React.useState(false);
  const [changePasswordOpened, setChangePasswordOpened] = React.useState(false);
  const [changePasswordSuccess, setChangePasswordSuccess] = React.useState<
    string | null
  >(null);
  const [changePasswordSuccessOpened, setChangePasswordSuccessOpened] =
    React.useState(false);
  const [changePasswordError, setChangePasswordError] = React.useState<{
    oldPassword: string | null;
    newPassword: string | null;
    confirmPassword: string | null;
  }>({
    oldPassword: null,
    newPassword: null,
    confirmPassword: null,
  });

  const [acccount, setAccount] = React.useState<AccountDetails>({
    username: 'Username',
    id: 0,
    name: 'Name',
    email: 'Email',
    has_face: false,
  });

  const accountClient = useAxios<AccountDetails>();
  const accountRecordClient = useAxios<AccountRecord[]>();
  const nextAccountRecordClient = useAxios<AccountRecord[]>();
  const disableFaceClient = useAxios();
  const pageSize = 20;

  const fetchRecords = () => {
    setRecords([...records, ...nextRecords]);
    nextAccountRecordClient.sendRequest(
      getAccountRecord({
        page: page + 1,
        page_size: pageSize,
      }),
    );
  };

  React.useEffect(() => {
    accountClient.sendRequest(getAccount());
    accountRecordClient.sendRequest(
      getAccountRecord({
        page,
        page_size: pageSize,
      }),
    );
    nextAccountRecordClient.sendRequest(
      getAccountRecord({
        page: page + 1,
        page_size: pageSize,
      }),
    );
    setPage(page + 1);
  }, []);

  React.useEffect(() => {
    if (!accountClient.response) return;

    if (accountClient.response.status === 200) {
      setAccount(accountClient.response.data);
    }
  }, [accountClient.response]);

  React.useEffect(() => {
    if (!accountRecordClient.response) return;

    if (accountRecordClient.response.status === 200) {
      setRecords([...records, ...accountRecordClient.response.data]);
    }
  }, [accountRecordClient.response]);

  React.useEffect(() => {
    if (!nextAccountRecordClient.response) return;

    if (nextAccountRecordClient.response.status === 200) {
      setNextRecords(nextAccountRecordClient.response.data);
    }
  }, [nextAccountRecordClient.response]);

  const accountChangePasswordClient = useAxios();

  React.useEffect(() => {
    if (!accountChangePasswordClient.response) return;

    if (accountChangePasswordClient.response.status === 200) {
      setChangePasswordError({
        oldPassword: null,
        newPassword: null,
        confirmPassword: null,
      });
      setChangePasswordSuccess('Password changed successfully');
      setChangePasswordSuccessOpened(true);
      accountClient.sendRequest(getAccount());
    }
  }, [accountChangePasswordClient.response]);

  React.useEffect(() => {
    if (!accountChangePasswordClient.error) return;

    setChangePasswordSuccess(null);
    setChangePasswordSuccessOpened(false);

    if (accountChangePasswordClient.error.response?.status === 400) {
      const data: any = accountChangePasswordClient.error.response?.data;
      if (data.old_password || data.new_password || data.confirm_password) {
        setChangePasswordError({
          oldPassword: data.old_password?.[0] ?? null,
          newPassword: data.new_password?.[0] ?? null,
          confirmPassword: data.confirm_password?.[0] ?? null,
        });
      } else if (data.detail) {
        setChangePasswordError({
          oldPassword: null,
          newPassword: null,
          confirmPassword: data.detail,
        });
      } else {
        setChangePasswordError({
          oldPassword: null,
          newPassword: null,
          confirmPassword: accountChangePasswordClient.error.message,
        });
      }
    } else {
      setChangePasswordError({
        oldPassword: null,
        newPassword: null,
        confirmPassword: accountChangePasswordClient.error.message,
      });
    }
  }, [accountChangePasswordClient.error]);

  React.useEffect(() => {
    setChangePasswordSuccessOpened(false);
    setChangePasswordSuccess(null);
    setChangePasswordError({
      oldPassword: null,
      newPassword: null,
      confirmPassword: null,
    });
  }, [changePasswordOpened]);

  const fetchMoreLogs = () => {
    setPage(page + 1);
    fetchRecords();
  };

  React.useEffect(() => {
    if (!disableFaceClient.response) return;

    if (disableFaceClient.response.status === 200) {
      accountClient.sendRequest(getAccount());
      setPage(1);
      setRecords([]);
      setNextRecords([]);
      fetchRecords();
    }
  }, [disableFaceClient.response]);

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

    // Validate new password cannot be same as old one
    if (data.get('oldPassword') === data.get('newPassword')) {
      setChangePasswordError({
        oldPassword: null,
        newPassword: 'New password cannot be same as the old password',
        confirmPassword: null,
      });
      return;
    }

    // Validate confirm password
    if (data.get('newPassword') !== data.get('confirmPassword')) {
      setChangePasswordError({
        oldPassword: null,
        newPassword: null,
        confirmPassword: 'Confirm password does not match',
      });
      return;
    }

    accountChangePasswordClient.sendRequest(
      postAccountChangePassword({
        old_password: data.get('oldPassword') as string,
        new_password: data.get('newPassword') as string,
      }),
    );
  };

  const handleDisableFaceLogin = () => {
    disableFaceClient.sendRequest(postDisableFace());
  };

  const handleEnableFaceLogin = () => {
    navigate('/face-setup/?redirect=/account/');
  };

  const changePasswordPanel = (
    <Box py={1} height="fit-content">
      <Panel title="Changing Password">
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="oldPassword"
            label="Old Password"
            name="oldPassword"
            type="password"
            autoComplete="password"
            error={!!changePasswordError.oldPassword}
            helperText={changePasswordError.oldPassword}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="newPassword"
            label="New Password"
            name="newPassword"
            type="password"
            autoComplete="new-password"
            error={!!changePasswordError.newPassword}
            helperText={changePasswordError.newPassword}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="confirmPassword"
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            error={!!changePasswordError.confirmPassword}
            helperText={changePasswordError.confirmPassword}
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
        <Collapse in={changePasswordSuccessOpened}>
          <Alert
            onClose={() => setChangePasswordSuccessOpened(false)}
            severity="success"
            sx={{ width: '100%', mt: 2 }}
          >
            {changePasswordSuccess}
          </Alert>
        </Collapse>
      </Panel>
    </Box>
  );

  return (
    <Container>
      <CssBaseline />
      <Panel title={acccount.name}>
        <Box display="flex" flexDirection="row" alignItems="center">
          <Box display="flex" flexDirection="column">
            <Box display="flex" flexDirection="row" alignItems="center">
              <Box mr={1}>Username:</Box>
              <Box>{acccount.username}</Box>
            </Box>
            <Box display="flex" flexDirection="row" alignItems="center">
              <Box mr={1}>UID:</Box>
              <Box>{acccount.id}</Box>
            </Box>
            <Box display="flex" flexDirection="row" alignItems="center">
              <Box mr={1}>Email:</Box>
              <Box>{acccount.email}</Box>
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
              <Collapse in={changePasswordOpened} sx={{ width: '100%' }}>
                {changingPassword && changePasswordPanel}
              </Collapse>
            </Box>
            <Box display="flex" flexDirection="row" gap={1}>
              {acccount.has_face ? (
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
                dataLength={records.length}
                next={fetchMoreLogs}
                loader={<Typography variant="h4">Loading...</Typography>}
                hasMore={nextRecords.length > 0}
                scrollableTarget="logBox"
              >
                {records
                  .map((log, i) => ({ log, i }))
                  .map(({ log, i }) => (
                    <Box
                      key={log.id}
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
                        {moment(new Date(log.time)).format(
                          'dddd YYYY-MM-DD HH:mm:ss',
                        )}
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
