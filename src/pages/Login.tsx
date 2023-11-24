import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import FaceIcon from '@mui/icons-material/Face';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import React from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import { useNavigate } from 'react-router-dom';
import LinearProgress from '@mui/material/LinearProgress';
import Webcam from 'react-webcam';
import { useTheme } from '@mui/material';
import { useCookies } from 'react-cookie';
import Panel from '../components/Panel';
import useAxios from '../hooks/useAxios';
import { LoginUsername, postLoginUsername } from '../models/LoginUsername';
import { postLogin, Login as LoginResponse } from '../models/Login';
import {
  FaceLogin,
  FaceLoginRequest,
  postFaceLogin,
} from '../models/FaceLogin';

function Login() {
  const navigate = useNavigate();

  const theme = useTheme();
  const [, setCookies] = useCookies();
  const [loading, setLoading] = React.useState(false);
  const [camera, setCamera] = React.useState(0);
  const [devices, setDevices] = React.useState<MediaDeviceInfo[]>([]);
  const [usernameError, setUsernameError] = React.useState<string | null>(null);
  const [passwordError, setPasswordError] = React.useState<string | null>(null);
  const [webcamError, setWebcamError] = React.useState<string | null>(null);
  const [username, setUsername] = React.useState<string | null>(null);
  const webcamRef = React.useRef<Webcam>(null);

  // 0 - username, 1 - password, 2 - face
  const [loginStage, setLoginStage] = React.useState(0);

  const clearAllErrors = () => {
    setUsernameError(null);
    setPasswordError(null);
    setWebcamError(null);
  };

  const videoConstraints = React.useMemo(
    () => ({
      deviceId: devices[camera]?.deviceId ?? devices[0]?.deviceId,
    }),
    [camera, devices],
  );

  const loginUsernameClient = useAxios<LoginUsername>();

  React.useEffect(() => {
    if (loginStage !== 0 || !loginUsernameClient.response) return;

    if (loginUsernameClient.response.status === 200) {
      setLoginStage(1);
      clearAllErrors();
    }
  }, [loginUsernameClient.response]);

  React.useEffect(() => {
    if (loginStage !== 0 || !loginUsernameClient.error) return;

    if (loginUsernameClient.error.response?.status === 401) {
      setUsernameError("Username doesn't exist");
    } else {
      console.log(loginUsernameClient.error);
      const data: any = loginUsernameClient.error.response?.data;
      if (data.detail) {
        setUsernameError(data.detail);
      } else if (data.username) {
        setUsernameError(data.username[0]);
      } else {
        setUsernameError(loginUsernameClient.error.message);
      }
    }
  }, [loginUsernameClient.error]);

  React.useEffect(() => {
    setLoading(loginUsernameClient.loading);
  }, [loginUsernameClient.loading]);

  const loginClient = useAxios<LoginResponse>();

  React.useEffect(() => {
    if (loginStage !== 1 || !loginClient.response) return;

    if (loginClient.response.status === 200) {
      setCookies('auth-token', loginClient.response.data.auth_token, {
        path: '/',
      });
      navigate('/');
    }
  }, [loginClient.response]);

  React.useEffect(() => {
    if (loginStage !== 1 || !loginClient.error) return;

    if (loginClient.error.response?.status === 401) {
      setPasswordError('Incorrect password');
    } else {
      const data: any = loginClient.error.response?.data;
      if (data.detail) {
        setPasswordError(data.detail);
      } else {
        setPasswordError(loginClient.error.message);
      }
    }
  }, [loginClient.error]);

  React.useEffect(() => {
    setLoading(loginClient.loading);
  }, [loginClient.loading]);

  const faceLoginClient = useAxios<FaceLogin, FaceLoginRequest>();

  React.useEffect(() => {
    if (loginStage !== 2 || !faceLoginClient.response) return;

    if (faceLoginClient.response.status === 200) {
      setCookies('auth-token', faceLoginClient.response.data.auth_token, {
        path: '/',
      });
      navigate('/');
    }
  }, [faceLoginClient.response]);

  React.useEffect(() => {
    if (loginStage !== 2 || !faceLoginClient.error) return;

    if (faceLoginClient.error.response?.status === 401) {
      const imageSrc = webcamRef.current?.getScreenshot();
      if (!imageSrc) return;

      if (!faceLoginClient.request?.data?.username) {
        setWebcamError('An error occurred');
      }
      faceLoginClient.sendRequest(
        postFaceLogin({
          username: username ?? '',
          image: imageSrc,
        }),
      );
    }
  }, [faceLoginClient.error]);

  const [timer, setTimer] = React.useState<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    if (loginStage !== 2) return;

    setTimer(
      setInterval(() => {
        const imageSrc = webcamRef.current?.getScreenshot();
        if (!imageSrc || !username || faceLoginClient.loading) return;

        faceLoginClient.sendRequest(
          postFaceLogin({
            username,
            image: imageSrc,
          }),
        );
      }, 200),
    );
  }, [loginStage]);

  // Disable timer if not stage 2
  React.useEffect(() => {
    if (loginStage === 2) return;

    if (timer) clearInterval(timer);
  }, [loginStage]);

  const handleUserMedia = () => setLoading(false);

  const handleDevices = React.useCallback(
    (mediaDevices: MediaDeviceInfo[]) =>
      setDevices(
        mediaDevices.filter(
          ({ kind }: MediaDeviceInfo) => kind === 'videoinput',
        ),
      ),
    [setDevices],
  );

  React.useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(handleDevices);
  }, [handleDevices]);

  const handleChangeCamera = () => {
    setCamera((camera + 1) % devices.length);
    setLoading(true);
  };

  const handleRegister = () => {
    navigate('/register/');
  };

  const handleBack = () => {
    clearAllErrors();
    setLoginStage(loginStage - 1);
  };

  const handleUseFace = () => {
    clearAllErrors();
    setLoading(true);
    setLoginStage(2);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    event.currentTarget.username.disabled = false;
    const data = new FormData(event.currentTarget);

    if (loginStage === 0) {
      setUsername(data.get('username') as string);
      loginUsernameClient.sendRequest(
        postLoginUsername({ username: data.get('username') as string }),
      );
    } else if (loginStage === 1) {
      setUsername(data.get('username') as string);
      loginClient.sendRequest(
        postLogin({
          username: data.get('username') as string,
          password: data.get('password') as string,
        }),
      );
      event.currentTarget.username.disabled = true;
    } else if (loginStage === 2) {
      event.currentTarget.username.disabled = true;
      setLoginStage(1);
    } else {
      console.error('Invalid login stage');
    }
  };

  return (
    <Container>
      <CssBaseline />
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        paddingY={2}
      >
        <Typography variant="h1" component="h1" mr={8}>
          Intelligent
          <br />
          Course
          <br />
          Management
          <br />
          System
        </Typography>
        <Box maxWidth={600} flexBasis="100%">
          <Panel>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5" gutterBottom>
                Login
              </Typography>
              <Box component="form" onSubmit={handleSubmit} width="100%">
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                  disabled={loginStage > 0}
                  autoFocus={loginStage === 0}
                  error={!!usernameError}
                  helperText={usernameError}
                />
                <Collapse in={loginStage === 1}>
                  <TextField
                    margin="normal"
                    required={loginStage === 1}
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="password"
                    autoFocus={loginStage === 1}
                    error={!!passwordError}
                    helperText={passwordError}
                  />
                  <Box
                    display="flex"
                    flexDirection="row"
                    justifyContent="space-between"
                    sx={{ my: 1 }}
                  >
                    <Button variant="contained" onClick={handleUseFace}>
                      <FaceIcon />
                      <Box sx={{ ml: 1 }} />
                      Face Login
                    </Button>
                  </Box>
                </Collapse>
                <Collapse in={loginStage === 2}>
                  <Box
                    width="100%"
                    display="flex"
                    flexDirection="row"
                    justifyContent="center"
                  >
                    <Button
                      variant="outlined"
                      onClick={handleChangeCamera}
                      sx={{ mt: 1, mb: 2 }}
                    >
                      Change Camera
                    </Button>
                  </Box>
                  <Box
                    sx={{ borderRadius: '8px', overflow: 'hidden' }}
                    border={webcamError ? '1px solid' : undefined}
                    borderColor={
                      webcamError ? theme.palette.error.main : undefined
                    }
                  >
                    {loginStage === 2 && (
                      <Webcam
                        ref={webcamRef}
                        width="100%"
                        style={{ display: 'flex' }}
                        videoConstraints={videoConstraints}
                        onUserMedia={handleUserMedia}
                      />
                    )}
                  </Box>
                  {webcamError && (
                    <Typography
                      variant="body2"
                      color="error"
                      textAlign="center"
                      sx={{ mt: 1 }}
                    >
                      {webcamError}
                    </Typography>
                  )}
                </Collapse>
                {loading && <LinearProgress sx={{ my: 2, width: '100%' }} />}
                <Box
                  display="flex"
                  flexDirection="row"
                  justifyContent="space-between"
                  sx={{ mt: 3, mb: 2 }}
                >
                  <Button
                    variant="outlined"
                    onClick={loginStage === 0 ? handleRegister : handleBack}
                  >
                    {loginStage === 0 ? 'Register' : 'Back'}
                  </Button>
                  <Button type="submit" variant="contained">
                    {loginStage === 0
                      ? 'Next'
                      : loginStage === 1
                      ? 'Login'
                      : 'Password'}
                  </Button>
                </Box>
              </Box>
            </Box>
          </Panel>
        </Box>
      </Box>
    </Container>
  );
}

export default Login;
