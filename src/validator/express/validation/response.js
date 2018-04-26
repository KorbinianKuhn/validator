const validateResponse = async (res, { status, schema, message }) => {
  const errors = {};
  let valid = true;

  if (res.status !== status) {
    errors.status = message.get("express_invalid_status_code", {
      expected: status,
      actual: res.status
    });
    valid = false;
  }

  try {
    res.body = await schema.validate(res.body);
  } catch (err) {
    errors.body = err;
    valid = false;
  }

  if (valid) {
    return res;
  } else {
    throw errors;
  }
};
const validateResponseSync = (res, { status, schema, message }) => {
  const errors = {};
  let valid = true;

  if (res.status !== status) {
    errors.status = message.get("express_invalid_status_code", {
      expected: status,
      actual: res.status
    });
    valid = false;
  }

  try {
    res.body = schema.validateSync(res.body);
  } catch (err) {
    errors.body = err;
    valid = false;
  }

  if (valid) {
    return res;
  } else {
    throw errors;
  }
};

module.exports = {
  validateResponse,
  validateResponseSync
};
