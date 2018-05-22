exports.toDate = (value, utc) => {
  console.log(value);
  console.log(new Date(value));
  if (utc) {
    return new Date(Date.UTC(value));
  } else {
    return new Date(value);
  }
};

exports.isValidDate = date => {
  return !isNaN(date.getTime());
};
