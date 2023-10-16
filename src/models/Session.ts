import moment from 'moment';
import Course from './Course';

interface Session {
  start: Date;
  end: Date;
  name: string;
}

export function formatDatetime(date: Date): string {
  return moment(date).format('YYYY-MM-DD HH:mm');
}

export function getStartTime(s: Session): string {
  return formatDatetime(s.start);
}

export function getEndTime(s: Session): string {
  return formatDatetime(s.end);
}

export function getSession(
  course: Course | null,
  start: string | Date,
): Session | null {
  // TODO: Get class detail from backend
  if (course === null) {
    return null;
  }

  if (start === '') {
    return null;
  }

  const s = typeof start === 'string' ? new Date(start) : start;
  const e = new Date(s);
  e.setHours(16, 20);

  return { start: s, end: e, name: course.code };
}

export default Session;
