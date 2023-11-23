import React from 'react';
import axios from 'axios';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import LinearProgress from '@mui/material/LinearProgress';
import Alert from '@mui/material/Alert';
import moment from 'moment';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import LinkIcon from '@mui/icons-material/Link';
import EmailIcon from '@mui/icons-material/Email';
import Panel from './Panel';
import CourseBadge from './CourseBadge';
import {
  CourseDetails,
  CourseDetailsFile,
  CourseDetailsHyperlink,
} from '../models/CourseDetails';
import { toSessionValue } from '../models/SessionType';
import { SessionDetails } from '../models/SessionDetails';
import { postMailMaterial } from '../models/MailMaterial';
import useAxios from '../hooks/useAxios';

const transition = 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)';

interface MaterialProps {
  owner: 'course' | 'session';
  ownerId: number | null;
  type: 'file' | 'hyperlink';
  material: CourseDetailsHyperlink | CourseDetailsFile;
}

function Material({ owner, ownerId, type, material }: MaterialProps) {
  const mailMaterialClient = useAxios();
  const [mailSuccess, setMailSuccess] = React.useState<string | null>(null);
  const [mailError, setMailError] = React.useState<string | null>(null);
  const [mailCompleted, setMailCompleted] = React.useState<
    'success' | 'error' | null
  >(null);

  const mailMaterial = () => {
    if (ownerId === null) return;
    setMailCompleted(null);
    mailMaterialClient.sendRequest(
      postMailMaterial({
        owner: owner.toUpperCase(),
        owner_id: ownerId,
        material: type.toUpperCase(),
        material_id: material.id,
      }),
    );
  };

  React.useEffect(() => {
    if (!mailMaterialClient.response) return;

    if (mailMaterialClient.response.status === 200) {
      setMailSuccess('Material sent successfully!');
      setMailCompleted('success');
    }
  }, [mailMaterialClient.response]);

  React.useEffect(() => {
    if (!mailMaterialClient.error) return;

    const data = mailMaterialClient.error.response?.data as any | undefined;
    if (data?.detail) {
      setMailError(data.detail);
    } else {
      setMailError(mailMaterialClient.error.message);
    }
    setMailCompleted('error');
  }, [mailMaterialClient.error]);

  return (
    <Panel title={material.name}>
      <Typography variant="caption">
        {moment(material.created_at).format('ddd YYYY-MM-DD HH:mm:ss')}
        {material.created_at === material.last_edit
          ? ''
          : ` (Last Edit: ${moment(material.last_edit).format(
              'ddd YYYY-MM-DD HH:mm:ss',
            )})`}
      </Typography>
      <Typography>{material.description}</Typography>
      {type === 'file'
        ? (() => {
            const m = material as CourseDetailsFile;
            const filename = m.file.split('/').pop();
            const download = () => {
              const link = document.createElement('a');
              link.target = '_blank';
              link.download = filename ?? 'File';
              axios
                .get(`${process.env.REACT_APP_BACKEND_BASE_URL}/${m.file}`, {
                  responseType: 'blob',
                })
                .then((res) => {
                  link.href = URL.createObjectURL(
                    new Blob([res.data], { type: 'file' }),
                  );
                  link.click();
                });
            };
            return (
              <Button
                fullWidth
                variant="contained"
                onClick={download}
                startIcon={<FileDownloadIcon />}
                sx={{ my: 1 }}
              >
                <Typography sx={{ textTransform: 'none' }}>
                  {filename}
                </Typography>
              </Button>
            );
          })()
        : (() => {
            const m = material as CourseDetailsHyperlink;
            return (
              <Button
                fullWidth
                href={m.url}
                target="_blank"
                rel="noreferrer"
                variant="contained"
                startIcon={<LinkIcon />}
                sx={{
                  display: 'inline-block',
                  my: 1,
                  whiteSpace: 'normal',
                  wordWrap: 'break-word',
                }}
              >
                <Typography
                  sx={{
                    textTransform: 'none',
                  }}
                >
                  {m.url}
                </Typography>
              </Button>
            );
          })()}
      <Button
        fullWidth
        variant="outlined"
        onClick={mailMaterial}
        startIcon={<EmailIcon />}
        sx={{ my: 1 }}
      >
        <Typography sx={{ textTransform: 'none' }}>Mail This to Me</Typography>
      </Button>
      <Collapse in={!!mailCompleted}>
        <Alert
          onClose={() => setMailCompleted(null)}
          severity={mailCompleted ?? undefined}
          sx={{ width: '100%', mt: 2 }}
        >
          {mailSuccess || mailError || 'Unknown error.'}
        </Alert>
      </Collapse>
      {mailMaterialClient.loading && (
        <LinearProgress sx={{ my: 2, width: '100%' }} />
      )}
    </Panel>
  );
}

export interface CoursePanelProps {
  course: CourseDetails | null;
  withinOneHour: boolean;
  session: SessionDetails | null;
  setSession: (id: number | null) => void;
  opened: boolean;
  onClose: () => void;
}

function CoursePanel({
  course,
  withinOneHour,
  session,
  setSession,
  opened,
  onClose,
}: CoursePanelProps) {
  const sessionPanelRef = React.useRef<HTMLDivElement>(null);

  const handleSessionSelection = (
    e: SelectChangeEvent<`${string} - ${string} (${string})`>,
  ) => {
    const id = parseInt(e.target.value, 10);
    if (id === 0) {
      setSession(null);
    } else {
      const s = course?.sessions.find((s) => s.id === id);
      if (s) {
        setSession(s.id ?? null);
      }
    }
  };

  // Merge files and hyperlinks by their order
  const sessionMaterials = React.useMemo(() => {
    if (!session) return [];
    const files = session.files.map((f) => ({
      ...f,
      type: 'file' as 'file' | 'hyperlink',
    }));
    const hyperlinks = session.hyperlinks.map((h) => ({
      ...h,
      type: 'hyperlink' as 'file' | 'hyperlink',
    }));
    const sessionMaterials = [...files, ...hyperlinks];
    sessionMaterials.sort((a, b) => a.order - b.order);
    return sessionMaterials;
  }, [session]);

  // Mix file and hyperlinks by their order
  const materials = React.useMemo(() => {
    if (!course) return [];
    const files = course.files.map((f) => ({
      ...f,
      type: 'file' as 'file' | 'hyperlink',
    }));
    const hyperlinks = course.hyperlinks.map((h) => ({
      ...h,
      type: 'hyperlink' as 'file' | 'hyperlink',
    }));
    const materials = [...files, ...hyperlinks];
    materials.sort((a, b) => a.order - b.order);
    return materials;
  }, [course]);

  return (
    <>
      <Panel
        title={course?.code}
        trailing={
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        }
        sx={{
          opacity: opened ? 1 : 0,
          transition,
        }}
      >
        {withinOneHour && (
          <Box display="flex" flexDirection="row" mb={1}>
            <CourseBadge text="<1h" />
          </Box>
        )}
        <Collapse in={!!course}>
          <Typography variant="h5" gutterBottom>
            {course?.name}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            {course?.year}-{course?.year ?? 0 + 1}
          </Typography>
          <Typography variant="body1">{course?.description}</Typography>
          <Box display="flex" flexDirection="column" gap={2} my={2}>
            {materials.map((m) => (
              <Material
                key={`${m.type}${m.id}`}
                owner="course"
                ownerId={course?.id ?? null}
                type={m.type}
                material={m}
              />
            ))}
          </Box>
        </Collapse>
        <FormControl sx={{ my: 2, minWidth: 200 }}>
          <InputLabel id="select-session-label">Session</InputLabel>
          <Select
            labelId="select-session-label"
            id="select-session"
            value={session ? (`${session.id}` as any) : ''}
            label="Session"
            onChange={handleSessionSelection}
          >
            <MenuItem value="0">
              <em>None</em>
            </MenuItem>
            {course?.sessions.map((s) => (
              <MenuItem key={s.id} value={s.id}>
                {`${moment(s.start_time).format(
                  'ddd YYYY-MM-DD HH:mm',
                )} - ${moment(s.end_time).format('HH:mm')} (${toSessionValue(
                  s.type,
                )})`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Collapse in={!!session}>
          <Box ref={sessionPanelRef}>
            <Typography>
              {session
                ? `${moment(session.start_time).format(
                    'dddd YYYY-MM-DD HH:mm',
                  )} - ${moment(session.end_time).format('HH:mm')}`
                : ''}
            </Typography>
            <Typography>
              {session
                ? `${toSessionValue(session.type)} (${session.classroom})`
                : ''}
            </Typography>
            <Box display="flex" flexDirection="column" gap={2} sx={{ my: 2 }}>
              {sessionMaterials.map((m) => (
                <Material
                  key={`${m.type}${m.id}`}
                  owner="session"
                  ownerId={session?.id ?? null}
                  type={m.type}
                  material={m}
                />
              ))}
            </Box>
          </Box>
        </Collapse>
      </Panel>
      <Box height={96} />
    </>
  );
}

export default CoursePanel;
