import Paper from '@mui/material/Paper';
import { SxProps } from '@mui/material/styles';
import React from 'react';

export interface PanelProps {
  children: React.ReactNode;
  sx?: React.CSSProperties;
}

function Panel({ children, sx }: PanelProps) {
  const defaultSx: SxProps = {
    p: 5,
    background: 'rgba(255, 255, 255, 0.75)',
    backdropFilter: 'blur(10px)',
  };
  const mergedSx = sx ? { ...defaultSx, ...sx } : defaultSx;

  return (
    <Paper elevation={2} sx={mergedSx}>
      {children}
    </Paper>
  );
}

Panel.defaultProps = {
  sx: undefined,
};

export default Panel;
