import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import './index.css';
import Login from './pages/Login';
import Register from './pages/Register';
import reportWebVitals from './reportWebVitals';
import Timetable from './pages/Timetable';
import Courses from './pages/Courses';
import Settings from './pages/Settings';
import NavBar from './components/NavBar';
import Account from './pages/Account';
import { SettingsContext } from './contexts/Settings';
import FaceLoginSetup from './pages/FaceLoginSetup';

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#68a030',
    },
    secondary: {
      main: '#00897b',
    },
    background: {
      paper: '#ffffff',
      default: '#f5f5f5',
    },
  },
  shape: {
    borderRadius: 8,
  },
} as Object);

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#68a030',
    },
    secondary: {
      main: '#00897b',
    },
    background: {
      paper: '#121212',
      default: '#121212',
    },
  },
  shape: {
    borderRadius: 8,
  },
} as Object);

function App() {
  const [settings, setSettings] = React.useState({
    darkMode: false,
  });

  return (
    <SettingsContext.Provider
      value={React.useMemo(
        () => ({ settings, setSettings }),
        [settings, setSettings],
      )}
    >
      <ThemeProvider theme={settings.darkMode ? darkTheme : lightTheme}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<NavBar />}>
              <Route path="timetable/" element={<Timetable />} />
              <Route path="courses/" element={<Courses />} />
              <Route path="account/" element={<Account />} />
              <Route path="face-setup/" element={<FaceLoginSetup />} />
              <Route path="settings/" element={<Settings />} />
            </Route>
            <Route path="/login/" element={<Login />} />
            <Route path="/register/" element={<Register />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </SettingsContext.Provider>
  );
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
