import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import Avatar from '@mui/material/Avatar';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import Panel from '../components/Panel';
import useQuery from '../hooks/useQuery';

function FaceLoginSetup() {
  const redirect = useQuery().get('redirect') ?? '/timetable/';
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(true);
  const [camera, setCamera] = React.useState(0);
  const [devices, setDevices] = React.useState<MediaDeviceInfo[]>([]);
  const [progress, setProgress] = React.useState<number | null | 'complete'>(
    null,
  );
  const [progressTimer, setProgressTimer] = React.useState<NodeJS.Timer | null>(
    null,
  );

  const videoConstraints = React.useMemo(
    () => ({
      deviceId: devices[camera]?.deviceId ?? devices[0]?.deviceId,
    }),
    [camera, devices],
  );

  const handleUserMedia = () => setLoading(false);

  const handleDevices = React.useCallback(
    (mediaDevices: MediaDeviceInfo[]) =>
      setDevices(
        mediaDevices.filter(
          ({ kind }: MediaDeviceInfo) => kind === 'videoinput',
        ),
      ),
    [setDevices],
  );

  const handleChangeCamera = () => {
    setCamera((camera + 1) % devices.length);
    setLoading(true);
  };

  const handleConfirm = () => {
    const progressTime = 3000;
    const interval = 500;
    setProgress(0);
    setProgressTimer(
      setInterval(() => {
        setProgress((oldProgress) => {
          if (oldProgress === null || oldProgress === 'complete') {
            return null;
          }

          if (oldProgress >= 100) {
            return 'complete';
          }

          const diff =
            (Math.random() * 0.5 + 0.75) * (interval / progressTime) * 100;
          return Math.min(oldProgress + diff, 100);
        });
      }, interval),
    );
  };

  React.useEffect(() => {
    if (progress === 'complete') {
      clearInterval(progressTimer as NodeJS.Timer);
    }
  }, [progress]);

  React.useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(handleDevices);
  }, [handleDevices]);

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
              <SentimentSatisfiedAltIcon />
            </Avatar>
            <Typography component="h1" variant="h5" gutterBottom>
              Face Login Setup
            </Typography>
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            width="100%"
            gap={2}
            mt={2}
          >
            <Button variant="outlined" onClick={handleChangeCamera}>
              Change Camera
            </Button>
            {loading && <LinearProgress sx={{ my: 2, width: '100%' }} />}
            <Box sx={{ borderRadius: '8px', overflow: 'hidden' }}>
              <Webcam
                width="100%"
                style={{ display: 'flex' }}
                videoConstraints={videoConstraints}
                onUserMedia={handleUserMedia}
              />
            </Box>
            {progress === null ? (
              <>
                <Typography variant="body2" textAlign="center">
                  Please ensure that your face is clearly visible.
                  <br />
                  Click &quot;CONFIRM&quot; below to start setup.
                </Typography>
                <Box display="flex" flexDirection="row" gap={2}>
                  <Button variant="outlined" onClick={() => navigate(redirect)}>
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleConfirm}
                    disabled={loading}
                  >
                    Confirm
                  </Button>
                </Box>
              </>
            ) : progress === 'complete' ? (
              <>
                <Typography variant="body2" textAlign="center">
                  Face login setup complete!
                  <br />
                  Click &quot;DONE&quot; below to continue.
                </Typography>
                <Button variant="contained" onClick={() => navigate(redirect)}>
                  Done
                </Button>
              </>
            ) : (
              <LinearProgress
                sx={{ my: 2, width: '100%' }}
                variant="determinate"
                value={progress}
              />
            )}
          </Box>
        </Panel>
      </Box>
    </Container>
  );
}

export default FaceLoginSetup;
