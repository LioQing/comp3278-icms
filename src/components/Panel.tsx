import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { SxProps, useTheme } from '@mui/material/styles';
import React from 'react';

export interface PanelProps {
  paperRef?: React.Ref<HTMLDivElement>;
  children?: React.ReactNode;
  title?: string;
  titleSx?: SxProps;
  trailing?: React.ReactNode;
  sx?: SxProps;
}

function Panel({
  paperRef,
  children,
  title,
  titleSx,
  trailing,
  sx,
}: PanelProps) {
  const theme = useTheme();
  const defaultSx: SxProps = {
    p: 5,
    pt: 3,
    backgroundColor: `${theme.palette.background.paper}C0`,
    backdropFilter: 'blur(8px)',
  };
  const mergedSx = sx ? { ...defaultSx, ...sx } : defaultSx;

  const defaultTitleSx: SxProps = {
    my: 1,
  };
  const mergedTitleSx = titleSx
    ? { ...defaultTitleSx, ...titleSx }
    : defaultTitleSx;

  return (
    <Paper elevation={2} sx={mergedSx} ref={paperRef}>
      {trailing ? (
        <Box display="flex" flexDirection="row" alignItems="center">
          <Typography variant="h5" sx={mergedTitleSx}>
            {title}
          </Typography>
          <Box flexGrow={1} />
          {trailing}
        </Box>
      ) : (
        title && (
          <Typography variant="h5" sx={mergedTitleSx}>
            {title}
          </Typography>
        )
      )}
      {children}
    </Paper>
  );
}

Panel.defaultProps = {
  paperRef: undefined,
  children: null,
  title: null,
  titleSx: undefined,
  trailing: null,
  sx: undefined,
};

export default Panel;
