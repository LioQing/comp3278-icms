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
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

const pages = [
  ['Home', '/home/'],
  ['Add', '/add/'],
  ['Account', '/account/'],
];

interface Props {
  window?: () => Window;
  children: React.ReactElement;
}

function ElevationScroll(props: Props) {
  const { children, window } = props;
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window ? window() : undefined,
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
    sx: {
      background: trigger ? 'rgba(255, 255, 255, 0.75)' : '#f5f5f5',
      ...children.props.sx,
    },
  });
}

function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget.parentElement!.parentElement);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSettings = () => {
    handleClose();
    navigate('/settings/');
  };

  const handleLogout = () => {
    // TODO: Modify local storage
    navigate('/login/');
  };

  return (
    <>
      <ElevationScroll>
        <AppBar
          position="sticky"
          sx={{
            color: 'primary.main',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Box width="100px">
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
                {pages.map(([name, path]) => (
                  <Button
                    key={path}
                    sx={{
                      display: 'block',
                      flex: 1,
                      mx: 1,
                      backgroundColor:
                        path === location.pathname
                          ? `${theme.palette.primary.main}26`
                          : undefined,
                    }}
                    onClick={() => {
                      if (path !== location.pathname) navigate(path);
                    }}
                  >
                    {name}
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
            >
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
          vertical: -10,
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
      <Box height={24} />
      <Outlet />
      <Box height={196} />
    </>
  );
}

export default NavBar;
