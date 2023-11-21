import Toolbar from '@mui/material/Toolbar';
import AppBar from '@mui/material/AppBar';
import React from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import useTheme from '@mui/material/styles/useTheme';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import moment from 'moment';
import { useCookies } from 'react-cookie';
import useAxios from '../hooks/useAxios';
import { postLogout } from '../models/Logout';
import { LastLogin, getLastLogin } from '../models/LastLogin';
import { ReactComponent as Logo } from '../logo.svg';

const pages = [
  {
    icon: <CalendarMonthIcon key="/timetable/" />,
    label: 'Timetable',
    path: '/timetable/',
  },
  {
    icon: <MenuBookIcon key="/courses/" />,
    label: 'Courses',
    path: '/courses/',
  },
  {
    icon: <AssignmentIndIcon key="/account/" />,
    label: 'Account',
    path: '/account/',
  },
];

interface ElevationScrollProps {
  window?: () => Window;
  children: React.ReactElement;
}

function ElevationScroll({ children, window }: ElevationScrollProps) {
  const theme = useTheme();
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window ? window() : undefined,
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
    sx: {
      background: trigger
        ? `${theme.palette.background.paper}C0`
        : theme.palette.background.default,
      backdropFilter: 'blur(8px)',
      ...children.props.sx,
    },
  });
}

function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const [, , removeCookies] = useCookies();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [lastLogin, setLastLogin] = React.useState<Date | null>(null);

  const logoutClient = useAxios();

  React.useEffect(() => {
    if (!logoutClient.response) return;
    removeCookies('auth-token', { path: '/' });
    navigate('/');
  }, [logoutClient]);

  const lastLoginClient = useAxios<LastLogin>();

  React.useEffect(() => {
    lastLoginClient.sendRequest(getLastLogin());
  }, []);

  React.useEffect(() => {
    if (!lastLoginClient.response) return;

    if (lastLoginClient.response.status === 200) {
      setLastLogin(new Date(lastLoginClient.response.data.last_login));
    }
  }, [lastLoginClient.response]);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSettings = () => {
    handleClose();
    navigate('/settings/');
  };

  const handleLogout = () => {
    logoutClient.sendRequest(postLogout());
  };

  return (
    <>
      <ElevationScroll>
        <AppBar
          position="fixed"
          sx={{
            color: 'primary.main',
            height: '64px',
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Box
              width="100px"
              flexGrow={1}
              display="flex"
              flexDirection="row"
              gap={1}
            >
              <Box height="2rem" width="2rem">
                <Logo height="100%" />
              </Box>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                ICMS
              </Typography>
            </Box>
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="center"
              alignItems="center"
              flex={1}
            >
              <Box
                width="100%"
                maxWidth={500}
                display="flex"
                flexDirection="row"
                justifyContent="space-evenly"
                m={0}
              >
                {pages.map(({ icon, label, path }) => (
                  <Button
                    key={path}
                    sx={{
                      display: 'block',
                      flex: 1,
                      mx: 1,
                      backgroundColor:
                        path === location.pathname
                          ? `${theme.palette.primary.main}1D`
                          : undefined,
                    }}
                    onClick={() => {
                      if (path !== location.pathname) navigate(path);
                    }}
                  >
                    <Box
                      display="flex"
                      flexDirection="row"
                      alignItems="center"
                      justifyContent="center"
                      gap={1}
                    >
                      {icon}
                      {label}
                    </Box>
                  </Button>
                ))}
              </Box>
            </Box>
            <Box
              width="100px"
              display="flex"
              flexDirection="row"
              justifyContent="flex-end"
              alignItems="center"
              flexGrow={1}
            >
              <Typography variant="body2">
                {lastLogin &&
                  `Last login: ${moment(lastLogin).format('YYYY-MM-DD HH:mm')}`}
              </Typography>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
      </ElevationScroll>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        disableScrollLock
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleSettings}>Settings</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
      <Box height={96} />
      <Outlet />
      <Box height={96} />
    </>
  );
}

export default NavBar;
