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
import moment from 'moment';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import LinkIcon from '@mui/icons-material/Link';
import Panel from './Panel';
import CourseBadge from './CourseBadge';
import {
  CourseDetails,
  CourseDetailsFile,
  CourseDetailsHyperlink,
} from '../models/CourseDetails';
import { toSessionValue } from '../models/SessionType';
import { SessionDetails } from '../models/SessionDetails';

const transition = 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)';

interface MaterialProps {
  type: 'file' | 'hyperlink';
  material: CourseDetailsHyperlink | CourseDetailsFile;
}

function Material({ type, material }: MaterialProps) {
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
                variant="outlined"
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
                variant="outlined"
                startIcon={<LinkIcon />}
                sx={{ my: 1 }}
              >
                <Typography sx={{ textTransform: 'none' }}>{m.url}</Typography>
              </Button>
            );
          })()}
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
              <Material key={m.id} type={m.type} material={m} />
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
                <Material key={m.id} type={m.type} material={m} />
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
