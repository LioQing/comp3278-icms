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
import { useTheme } from '@mui/material';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import Panel from '../components/Panel';
import useQuery from '../hooks/useQuery';
import useAxios from '../hooks/useAxios';
import { postSetupFace } from '../models/SetupFace';

function FaceLoginSetup() {
  const theme = useTheme();
  const redirect = useQuery().get('redirect') ?? '/timetable/';
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(true);
  const [camera, setCamera] = React.useState(0);
  const [faces, setFaces] = React.useState<string[]>([]);
  const [devices, setDevices] = React.useState<MediaDeviceInfo[]>([]);
  const [progress, setProgress] = React.useState<
    number | null | 'complete' | 'success'
  >(null);
  const [error, setError] = React.useState<string | null>(null);
  const [progressTimer, setProgressTimer] = React.useState<NodeJS.Timer | null>(
    null,
  );
  const webcamRef = React.useRef<Webcam>(null);

  const videoConstraints = React.useMemo(
    () => ({
      deviceId: devices[camera]?.deviceId ?? devices[0]?.deviceId,
    }),
    [camera, devices],
  );

  const setupFaceClient = useAxios();

  React.useEffect(() => {
    if (!setupFaceClient.response) return;

    if (setupFaceClient.response.status === 200) {
      setProgress('success');
      setError(null);
    }
  }, [setupFaceClient.response]);

  React.useEffect(() => {
    if (!setupFaceClient.error) return;

    setProgress(null);
    const data: any = setupFaceClient.error.response?.data;
    if (data.images) {
      setError(data.images);
    } else {
      setError(setupFaceClient.error.message);
    }
  }, [setupFaceClient.error]);

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
    const imageSrc = webcamRef.current?.getScreenshot();
    if (!imageSrc) return;

    const progressTime = 3000;
    const interval = 100;
    setProgress(0);
    setFaces([]);
    setError(null);
    setProgressTimer(
      setInterval(() => {
        setProgress((oldProgress) => {
          if (
            oldProgress === null ||
            oldProgress === 'complete' ||
            oldProgress === 'success'
          ) {
            return null;
          }

          if (oldProgress >= 100) {
            return 'complete';
          }

          const imageSrc = webcamRef.current?.getScreenshot();
          if (!imageSrc) {
            setError('Failed to capture image');
            return null;
          }

          setFaces((oldFaces) => [...oldFaces, imageSrc]);

          const diff = (interval / progressTime) * 100;
          return Math.min(oldProgress + diff, 100);
        });
      }, interval),
    );
  };

  React.useEffect(() => {
    if (progress === 'complete') {
      clearInterval(progressTimer as NodeJS.Timer);
      setupFaceClient.sendRequest(
        postSetupFace({
          images: faces,
        }),
      );
      setFaces([]);
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
            <Box
              sx={{ borderRadius: '8px', overflow: 'hidden' }}
              border={error ? '1px solid' : undefined}
              borderColor={error ? theme.palette.error.main : undefined}
            >
              <Webcam
                ref={webcamRef}
                width="100%"
                style={{ display: 'flex' }}
                videoConstraints={videoConstraints}
                onUserMedia={handleUserMedia}
                screenshotFormat="image/jpeg"
              />
            </Box>
            {error && (
              <Typography variant="body2" color="error" textAlign="center">
                {error}
              </Typography>
            )}
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
            ) : progress === 'success' ? (
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
            ) : progress === 'complete' ? (
              <>
                <LinearProgress sx={{ my: 2, width: '100%' }} />
                <Typography variant="body2" textAlign="center">
                  Please wait while we build your ID...
                </Typography>
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
