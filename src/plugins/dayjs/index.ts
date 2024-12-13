import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';

dayjs.extend(duration);
dayjs.extend(utc);

function formatMinutes(minutes: number) {
  const timeDuration = dayjs.duration(minutes, 'minutes');
  return timeDuration.format('H[h] m[m]');
}

function formatDate(dateTimeString: string): string {
  console.log(dateTimeString);
  return dayjs.utc(dateTimeString).format('ddd D MMM YYYY, HH:mm');
}

function extractTime(dateTimeString: string): string {
  return dayjs.utc(dateTimeString).format('hh:mm A');
}

export { formatMinutes, formatDate, extractTime };

