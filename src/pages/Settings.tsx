import React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import SettingsIcon from '@mui/icons-material/Settings';
import Avatar from '@mui/material/Avatar';
import Panel from '../components/Panel';
import { SettingsContext } from '../contexts/Settings';

function Settings() {
  const { settings, setSettings } = React.useContext(SettingsContext);

  return (
    <Container>
      <CssBaseline />
      <Box display="flex" flexDirection="row" justifyContent="center">
        <Panel sx={{ width: 600 }}>
          <Box
            width="100%"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
              <SettingsIcon />
            </Avatar>
            <Typography component="h1" variant="h5" gutterBottom>
              Settings
            </Typography>
            <Box
              display="flex"
              width="100%"
              flexDirection="row"
              justifyContent="space-between"
            >
              <Typography variant="h6">Dark Mode</Typography>
              <Switch
                checked={settings.darkMode}
                onClick={() =>
                  setSettings({ ...settings, darkMode: !settings.darkMode })
                }
              />
            </Box>
          </Box>
        </Panel>
      </Box>
    </Container>
  );
}

export default Settings;
