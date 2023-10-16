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
import { useNavigate } from 'react-router-dom';
import Hyperlink from '../components/Hyperlink';
import Panel from '../components/Panel';

function Login() {
  const navigate = useNavigate();

  // 0 - username, 1 - password/face
  const [loginStage, setLoginStage] = React.useState(0);

  const handleRegister = () => {
    navigate('/register/');
  };

  const handleBack = () => {
    setLoginStage(0);
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
                {loginStage === 1 && (
                  <>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      name="password"
                      label="Password"
                      type="password"
                      id="password"
                      autoComplete="current-password"
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
                      <Button variant="contained">
                        <FaceIcon />
                        <Box sx={{ ml: 1 }} />
                        Face Login
                      </Button>
                    </Box>
                  </>
                )}
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
                      {loginStage === 0 ? 'Next' : 'Login'}
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
