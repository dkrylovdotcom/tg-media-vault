import dayjs, { Dayjs, OpUnitType, QUnitType } from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { MAX_DAYS_TO_FORMAT } from '../consts';

dayjs.extend(relativeTime);

type ReturnType = 'short' | 'long';

export const formatTime = (
  time: Dayjs | Date | string | number,
  returnType: ReturnType = 'short',
): string => {
  const dateTime = dayjs(typeof time === 'number' ? time * 1000 : time);

  let format = 'DD.MM.YYYY';
  if (returnType === 'long') {
    format = 'DD.MM.YYYY HH:mm';
  }

  return dateTime.format(format);
};

export const getRelativeTime = (
  time: Date | string | number,
  returnType: ReturnType = 'short',
): string => {
  const dateTime = dayjs(typeof time === 'number' ? time * 1000 : time);
  const now = dayjs();
  const diffInDays = now.diff(dateTime, 'days');

  if (diffInDays >= MAX_DAYS_TO_FORMAT) {
    return formatTime(dateTime, returnType);
  }

  const relativeDate = dayjs().from(dayjs(dateTime), true);

  return `${relativeDate} ago`;
};

export const compareTime = (
  time: Date | string,
  moreThanDays: number,
): boolean => {
  const diffInDays = getTimeDiff(time, 'days');

  return diffInDays >= moreThanDays;
};

export const getTimeDiff = (
  time: Date | string | number,
  unit: QUnitType | OpUnitType,
): number => {
  const isNumber = typeof time === 'number';
  if (isNumber) {
    time = Number(time);
    const isInMilliseconds = time < 1e12;
    if (isInMilliseconds) {
      time *= 1000;
    }
  }
  const dateTime = dayjs(time);
  const now = dayjs();

  return Math.abs(now.diff(dateTime, unit));
};
