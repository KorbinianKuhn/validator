const toDate = (message, value, utc) => {
  const date = new Date(value);
  if (isNaN(date.getTime())) {
    throw message.get('date_invalid', {});
  }
  return utc ? toUTC(date) : date;
};
exports.toDate = toDate;

const toUTC = date => {
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
