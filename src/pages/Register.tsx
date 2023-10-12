import React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import Panel from '../components/Panel';

interface RegisterFormProps {
  handleBack: () => void;
  handleSubmit: () => void;
}

function RegisterForm({ handleBack, handleSubmit }: RegisterFormProps) {
  return (
    <Box component="form" onSubmit={handleSubmit} width="100%" mt={1}>
      <TextField
        margin="normal"
        required
        fullWidth
        id="username"
        label="Username"
        name="username"
        autoFocus
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type="password"
        id="password"
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="confirm password"
        label="Confirm Password"
        type="password"
        id="confirm-password"
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
    <Box width="100%" mt={1}>
      <Typography variant="body1" color="inherit">
        Do you want to setup face login? (You can do this later)
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

  // 0 - user info, 1 - ask for face
  const [registerStage, setRegisterStage] = React.useState(0);
  const [title, setTitle] = React.useState('Register');

  const handleSecondaryButton = React.useCallback(() => {
    if (registerStage === 0) {
      navigate('/login/');
    } else if (registerStage === 1) {
      navigate('/home/');
    } else {
      console.error('Invalid register stage');
    }
  }, [navigate, registerStage]);

  const handlePrimaryButton = React.useCallback(() => {
    console.log('Register');

    if (registerStage === 0) {
      setRegisterStage(1);
      setTitle('Successfully Registered!');
    } else if (registerStage === 1) {
      // TODO: Navigate to setup face login page
      navigate('/home/');
    } else {
      console.error('Invalid register stage');
    }
  }, [registerStage]);

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
        <Box maxWidth={500} flexBasis="100%">
          <Panel>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                <AppRegistrationIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                {title}
              </Typography>
              {registerStage === 0 ? (
                <RegisterForm
                  handleBack={handleSecondaryButton}
                  handleSubmit={handlePrimaryButton}
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
