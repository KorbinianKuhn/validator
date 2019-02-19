import { Message } from './message';

export const toDate = (message: Message, value: any, utc: boolean): Date => {
  const date = new Date(value);
  if (isNaN(date.getTime())) {
    throw message.get('date_invalid', {});
  }
  return utc ? toUTC(date) : date;
};

export const toUTC = (date: Date): Date => {
  return new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      date.getUTCHours(),
      date.getUTCMinutes(),
      date.getUTCSeconds(),
      date.getUTCMilliseconds()
    )
  );
};
