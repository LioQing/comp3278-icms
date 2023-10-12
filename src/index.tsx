import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import './index.css';
import Login from './pages/Login';
import Register from './pages/Register';
import reportWebVitals from './reportWebVitals';
import Home from './pages/Home';
import Add from './pages/Add';
import Settings from './pages/Settings';
import NavBar from './components/NavBar';
import Account from './pages/Account';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#68a030',
    },
    secondary: {
      main: '#00897b',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  shape: {
    borderRadius: 8,
  },
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<NavBar />}>
            <Route path="home/" element={<Home />} />
            <Route path="add/" element={<Add />} />
            <Route path="account/" element={<Account />} />
            <Route path="settings/" element={<Settings />} />
          </Route>
          <Route path="/login/" element={<Login />} />
          <Route path="/register/" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
