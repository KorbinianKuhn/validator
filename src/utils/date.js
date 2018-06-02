const moment = require('moment');

const toMomentDate = (message, value, utc, format, strict) => {
  const momentDate = utc
    ? moment.utc(value, format, strict)
    : moment(value, format, strict);

  if (momentDate.isValid()) {
    return momentDate;
  } else {
    throw message.get('date_invalid', { format });
  }
};
exports.toMomentDate = toMomentDate;
