import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import FaceIcon from '@mui/icons-material/Face';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import React from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Collapse from '@mui/material/Collapse';
import { useNavigate } from 'react-router-dom';
import LinearProgress from '@mui/material/LinearProgress';
import Webcam from 'react-webcam';
import Hyperlink from '../components/Hyperlink';
import Panel from '../components/Panel';

function Login() {
  const navigate = useNavigate();

  const [loading, setLoading] = React.useState(true);
  const [camera, setCamera] = React.useState(0);
  const [devices, setDevices] = React.useState<MediaDeviceInfo[]>([]);

  // 0 - username, 1 - password, 2 - face
  const [loginStage, setLoginStage] = React.useState(0);

  const videoConstraints = React.useMemo(
    () => ({
      deviceId: devices[camera]?.deviceId ?? devices[0]?.deviceId,
    }),
    [camera, devices],
  );

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
    setLoginStage(0);
  };

  const handleUseFace = () => {
    setLoginStage(2);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    event.currentTarget.username.disabled = false;
    const data = new FormData(event.currentTarget);
    event.currentTarget.username.disabled = true;

    console.log({
      username: data.get('username'),
      password: data.get('password'),
      remember: data.get('remember'),
    });

    if (loginStage === 0) {
      // TODO: Check username with backend
      setLoginStage(1);
    } else if (loginStage === 1) {
      // TODO: Check password/face with backend
      navigate('/timetable/');
    } else if (loginStage === 2) {
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
                  autoFocus
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
                  />
                  <Box
                    display="flex"
                    flexDirection="row"
                    justifyContent="space-between"
                    sx={{ my: 1 }}
                  >
                    <FormControlLabel
                      control={<Checkbox value="remember" color="primary" />}
                      name="remember"
                      label="Remember me"
                      id="remember"
                    />
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
                  <Collapse in={loading}>
                    <LinearProgress sx={{ my: 2, width: '100%' }} />
                  </Collapse>
                  <Box sx={{ borderRadius: '8px', overflow: 'hidden' }}>
                    <Webcam
                      width="100%"
                      style={{ display: 'flex' }}
                      videoConstraints={videoConstraints}
                      onUserMedia={handleUserMedia}
                    />
                  </Box>
                </Collapse>
                <Box
                  display="flex"
                  flexDirection="row"
                  justifyContent="space-between"
                  sx={{ mt: 3, mb: 2 }}
                >
                  <Hyperlink to="/timetable/">
                    <Typography variant="body2" color="inherit">
                      {loginStage === 0
                        ? 'Forget username?'
                        : 'Forget password?'}
                    </Typography>
                  </Hyperlink>
                  <Stack direction="row" spacing={2}>
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
                  </Stack>
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
