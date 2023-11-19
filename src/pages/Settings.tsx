import React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import SettingsIcon from '@mui/icons-material/Settings';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Panel from '../components/Panel';
import { SettingsContext } from '../contexts/Settings';
import useLocalStorage from '../hooks/useLocalStorage';

interface SettingSwitchProps {
  name: string;
  checked: boolean;
  onClick: () => void;
}

function SettingSwitch({ name, checked, onClick }: SettingSwitchProps) {
  return (
    <Box
      display="flex"
      width="100%"
      flexDirection="row"
      justifyContent="space-between"
    >
      <Typography variant="subtitle1">{name}</Typography>
      <Switch checked={checked} onClick={onClick} />
    </Box>
  );
}

function Settings() {
  const { settings, setSettings } = React.useContext(SettingsContext);
  const [timetableSettings, setTimetableSettings] = useLocalStorage(
    'timetableSettings',
    {
      'Show Time': false,
      'Show Name': false,
      'Show Classroom': false,
      'Show Session Type': false,
    },
  );

  // If key does not match, reset to default
  React.useEffect(() => {
    const defaultSettings = {
      darkMode: false,
    };

    const defaultTimetableSettings = {
      'Show Time': false,
      'Show Name': false,
      'Show Classroom': false,
      'Show Session Type': false,
    };

    // If any key is missing or there is any extra key, reset to default
    if (
      Object.keys(settings).length !== Object.keys(defaultSettings).length ||
      Object.keys(timetableSettings).length !==
        Object.keys(defaultTimetableSettings).length ||
      Object.keys(settings).some((key) => !(key in defaultSettings)) ||
      Object.keys(timetableSettings).some(
        (key) => !(key in defaultTimetableSettings),
      )
    ) {
      setSettings(defaultSettings);
      setTimetableSettings(defaultTimetableSettings);
    }
  }, []);

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
            <Divider sx={{ width: '100%', my: 1 }} />
            <Typography component="h1" variant="h6" gutterBottom>
              Theme
            </Typography>
            <SettingSwitch
              name="Dark Mode"
              checked={settings.darkMode}
              onClick={() => {
                setSettings({ ...settings, darkMode: !settings.darkMode });
              }}
            />
            <Divider sx={{ width: '100%', my: 1 }} />
            <Typography component="h1" variant="h6" gutterBottom>
              Timetable
            </Typography>
            {Object.entries(timetableSettings).map(([key, value]) => (
              <SettingSwitch
                key={key}
                name={key}
                checked={value}
                onClick={() => {
                  setTimetableSettings({
                    ...timetableSettings,
                    [key]: !value,
                  });
                }}
              />
            ))}
          </Box>
        </Panel>
      </Box>
    </Container>
  );
}

export default Settings;
