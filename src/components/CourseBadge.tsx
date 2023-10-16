import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import React from 'react';

export interface CourseBadgeProps {
  text: string;
}

function CourseBadge({ text }: CourseBadgeProps) {
  return (
    <Box
      sx={{
        bgcolor: 'primary.main',
        color: 'primary.contrastText',
        borderRadius: '100vh',
        px: 1,
      }}
    >
      <Typography variant="caption">{text}</Typography>
    </Box>
  );
}

export default CourseBadge;
