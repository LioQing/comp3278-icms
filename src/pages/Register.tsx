import React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import DoneIcon from '@mui/icons-material/Done';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import Panel from '../components/Panel';
import useAxios from '../hooks/useAxios';
import { Register as RegisterResponse, postRegister } from '../models/Register';

interface RegisterFormProps {
  handleBack: () => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  errors: { [key: string]: string | null };
}

function RegisterForm({ handleBack, handleSubmit, errors }: RegisterFormProps) {
  console.log(errors);
  return (
    <Box component="form" onSubmit={handleSubmit} width="100%">
      <TextField
        margin="normal"
        required
        fullWidth
        id="name"
        label="Name"
        name="name"
        autoComplete="name"
        autoFocus
        error={!!errors.name}
        helperText={errors.name}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email"
        name="email"
        autoComplete="email"
        autoFocus
        error={!!errors.email}
        helperText={errors.email}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        id="id"
        label="UID"
        name="id"
        autoComplete="new-password"
        autoFocus
        error={!!errors.id}
        helperText={errors.id}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        id="username"
        label="Username"
        name="username"
        autoComplete="new-password"
        autoFocus
        error={!!errors.username}
        helperText={errors.username}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type="password"
        id="password"
        autoComplete="new-password"
        autoFocus
        error={!!errors.password}
        helperText={errors.password}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="confirm_password"
        label="Confirm Password"
        type="password"
        id="confirm-password"
        autoComplete="new-password"
        autoFocus
        error={!!errors.confirm_password}
        helperText={errors.confirm_password}
      />
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        sx={{ mt: 3, mb: 2 }}
      >
        <Button type="submit" variant="contained" sx={{ mb: 2 }} fullWidth>
          Register
        </Button>
        <Button onClick={handleBack} variant="outlined" fullWidth>
          Login Instead
        </Button>
      </Box>
    </Box>
  );
}

interface AskForFaceProps {
  handleNo: () => void;
  handleYes: () => void;
}

function AskForFace({ handleNo, handleYes }: AskForFaceProps) {
  return (
    <Box width="100%">
      <Typography variant="body1" color="inherit" textAlign="center">
        Do you want to setup face login now? (You can do this later)
      </Typography>
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="center"
        sx={{ mt: 3, mb: 2 }}
      >
        <Button onClick={handleNo} variant="outlined" sx={{ mr: 2 }}>
          No
        </Button>
        <Button onClick={handleYes} variant="contained">
          Yes
        </Button>
      </Box>
    </Box>
  );
}

function Register() {
  const navigate = useNavigate();
  const [, setCookies] = useCookies();
  const registerClient = useAxios<RegisterResponse>();

  // 0 - user info, 1 - ask for face
  const [registerStage, setRegisterStage] = React.useState(0);
  const [title, setTitle] = React.useState('Register');
  const [errors, setErrors] = React.useState<{ [key: string]: string | null }>({
    name: null,
    email: null,
    id: null,
    username: null,
    password: null,
    confirm_password: null,
  });

  const handleSecondaryButton = React.useCallback(() => {
    if (registerStage === 0) {
      navigate('/login/');
    } else if (registerStage === 1) {
      navigate('/timetable/');
    } else {
      console.error('Invalid register stage');
    }
  }, [navigate, registerStage]);

  const handlePrimaryButton = React.useCallback(
    (event?: React.FormEvent<HTMLFormElement>) => {
      if (registerStage === 0 && event) {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        // validate
        if (data.get('password') !== data.get('confirm_password')) {
          setErrors({
            name: null,
            email: null,
            id: null,
            username: null,
            password: 'Passwords do not match',
            confirm_password: 'Passwords do not match',
          });
          return;
        }

        setErrors({
          name: null,
          email: null,
          id: null,
          username: null,
          password: null,
          confirm_password: null,
        });
        registerClient.sendRequest(
          postRegister({
            name: data.get('name') as string,
            email: data.get('email') as string,
            id: data.get('id') as string,
            username: data.get('username') as string,
            password: data.get('password') as string,
          }),
        );
      } else if (registerStage === 1) {
        navigate('/face-setup/?redirect=/');
      } else {
        console.error('Invalid register stage');
      }
    },
    [registerStage],
  );

  React.useEffect(() => {
    if (!registerClient.response) return;

    if (registerClient.response.status === 200) {
      setCookies('auth-token', registerClient.response.data.auth_token, {
        path: '/',
      });
      setRegisterStage(1);
      setTitle('Register Successful');
    }
  }, [registerClient.response]);

  React.useEffect(() => {
    if (!registerClient.error) return;

    const data = registerClient.error.response?.data as any;
    if (data) {
      setErrors({
        name: data.name ? data.name[0] : null,
        email: data.email ? data.email[0] : null,
        id: data.id ? data.id[0] : null,
        username: data.username ? data.username[0] : null,
        password: data.password ? data.password[0] : null,
        confirm_password: data.confirm_password
          ? data.confirm_password[0]
          : null,
      });
    } else {
      setErrors({
        name: null,
        email: null,
        id: null,
        username: null,
        password: null,
        confirm_password: registerClient.error.message,
      });
    }
  }, [registerClient.error]);

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
        my={2}
      >
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
                {registerStage === 0 ? <AppRegistrationIcon /> : <DoneIcon />}
              </Avatar>
              <Typography component="h1" variant="h5" gutterBottom>
                {title}
              </Typography>
              {registerStage === 0 ? (
                <RegisterForm
                  handleBack={handleSecondaryButton}
                  handleSubmit={handlePrimaryButton}
                  errors={errors}
                />
              ) : (
                <AskForFace
                  handleNo={handleSecondaryButton}
                  handleYes={handlePrimaryButton}
                />
              )}
            </Box>
          </Panel>
        </Box>
      </Box>
    </Container>
  );
}

export default Register;
