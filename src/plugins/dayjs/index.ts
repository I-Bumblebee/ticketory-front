import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

function formatMinutes(minutes: number) {
  const timeDuration = dayjs.duration(minutes, 'minutes');
  return timeDuration.format('H[h] m[m]');
}

function formatDate(date: Date): string {
  return dayjs(date).format('ddd D MMM YYYY, HH:mm');
}

export { formatMinutes, formatDate };
