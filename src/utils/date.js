const toDate = (message, value, utc) => {
  const date = new Date(value);
  if (isNaN(date.getTime())) {
    throw message.get('date_invalid', {});
  }
  return utc ? setUTCTimezone(date) : date;
};
exports.toDate = toDate;

const setUTCTimezone = date => {
  //date.setTime(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
  return date;
};
