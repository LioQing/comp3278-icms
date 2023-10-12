import React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';

function Settings() {
  return (
    <Container>
      <CssBaseline />
      <Box
        display="flex"
        height="150vh"
        alignItems="center"
        justifyContent="center"
      >
        Settings page.
      </Box>
    </Container>
  );
}

export default Settings;
