import React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';

function Account() {
  return (
    <Container>
      <CssBaseline />
      <Box
        display="flex"
        height="150vh"
        alignItems="center"
        justifyContent="center"
      >
        Account page.
      </Box>
    </Container>
  );
}

export default Account;
