const validateAngular = async (func) => {
  try {
    await func;
    return null;
  } catch (err) {
    return { validation: err };
  }
};

exports.validate = async (type, func) => {
  switch (type) {
    case 'angular':
      return validateAngular(func);
    default:
      return func;
  }
};
exports.validate();
